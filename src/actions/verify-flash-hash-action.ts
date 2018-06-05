import {DeviceClient} from "../device-client";
import {Features} from "../global/features";
import {sha3_256} from 'js-sha3';
import * as Bitcore from "bitcore-lib";
import ByteBuffer = require('bytebuffer');
import {DeviceMessageHelper} from "../device-message-helper";
import FlashWrite = DeviceMessages.FlashWrite;
import FlashHash = DeviceMessages.FlashHash;
import FlashHashResponse = DeviceMessages.FlashHashResponse;
import * as _ from 'lodash';
import {DeviceSectorProvider, SectorData} from "../global/device-sector-provider";
const FlashBinaries = require('../../dist/flash-bin-dictionary.json');

export enum VerifyFlashSteps {
  starting,
  createRandomData,
  writeRandomData,
  sectorVerification,
  findB64Asset,
  hashSectors,
  validateFlash
}

export enum VerifyFlashResult {
  inProgress,
  successful,
  failure
}

export type VerifyFlashCount = {
  count: number,
  max: number,
}

export type VerifyFlashStatus = {
  step: VerifyFlashSteps,
  result: VerifyFlashResult,
  sector?: SectorData,
  location?: number,
  size?: number,
  initialize?: VerifyFlashCount,
  writeRandomData?: VerifyFlashCount,
  b64Asset?: VerifyFlashCount,
  hashSector?: VerifyFlashCount,
  sectorVerification?: VerifyFlashCount,
}

export type StatusCallbackFunction = (message: VerifyFlashStatus) => Promise<void>;

const MAX_CHUNK_SIZE = 1024;
const CHALLENGE_SIZE = 32;
const MAX_BYTES_OF_ENTROPY_AVAILABLE = 65536;

export class VerifyFlashHashAction {

  public static operation(client: DeviceClient, statusCallback?: StatusCallbackFunction): Promise<any> {
    let protectedStatusCallback: StatusCallbackFunction = (...args) => statusCallback && statusCallback.apply(this, args);
    return client.featuresService.promise
      .then((features: Features) => {
        protectedStatusCallback({
          step: VerifyFlashSteps.starting,
          result: VerifyFlashResult.inProgress,
        });
        let promise = Promise.resolve();
        DeviceSectorProvider.getInstance().sectorData.forEach((sectorData: SectorData) => {
          let remaining = sectorData.size;
          sectorData.buffer = new ByteBuffer(remaining);

          protectedStatusCallback({
            step: VerifyFlashSteps.createRandomData,
            result: VerifyFlashResult.inProgress,
            sector: _.omit(sectorData, 'buffer'),

            // max is number of iterations, count is the amount to increment.
            initialize: {count: 1, max: 8},
          });

          while (remaining > 0) {
            let requestedBytes = Math.min(remaining, MAX_BYTES_OF_ENTROPY_AVAILABLE);
            sectorData.buffer.append(Bitcore.crypto.Random.getRandomBuffer(requestedBytes));
            remaining -= requestedBytes;
          }

          promise = promise.then(() => {
            return VerifyFlashHashAction.writeSector(client, sectorData, protectedStatusCallback)
              .then(() => VerifyFlashHashAction.fetchB64Assets(client, sectorData, protectedStatusCallback));
          });
        });
        return promise;
      })
      .then(() => {
        let challenge = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(CHALLENGE_SIZE));
        console.assert(challenge.limit === CHALLENGE_SIZE, "Challenge buffer size is wrong");

        var hash = sha3_256.create();
        hash.update(challenge.toArrayBuffer());
        DeviceSectorProvider.getInstance().sectorData.forEach((sector) => {
          protectedStatusCallback({
            step: VerifyFlashSteps.hashSectors,
            result: VerifyFlashResult.inProgress,
            sector: _.omit(sector, 'buffer'),
            hashSector: {count: 1, max: 8},
          });
          hash.update(sector.buffer.toArrayBuffer());
        });

        return {challenge: challenge, expectedHash: hash.hex()};
      })
      .then((obj) => {
        let result: VerifyFlashResult;
        return VerifyFlashHashAction.validateFlashContents(client, obj.challenge, obj.expectedHash)
          .then(() => result = VerifyFlashResult.successful)
          .catch((msg) => {
            console.error(msg);
            result = VerifyFlashResult.failure;
          })
          .then(() => {
            protectedStatusCallback({
              step: VerifyFlashSteps.sectorVerification,
              result: result,
              sectorVerification: {count: 1, max: 1},
            });
          });
      })
      .catch((msg) => {
        console.error(msg)
      });
  }

  private static writeSector(client: DeviceClient, sectorData: SectorData, statusCallback: StatusCallbackFunction): Promise<any> {
    let promise = Promise.resolve();

    // skip read-only sectors
    if (sectorData.ro) { return promise; }

    for (let pos = sectorData.start; pos <= sectorData.end; pos += MAX_CHUNK_SIZE) {
      let message: FlashWrite = DeviceMessageHelper.factory('FlashWrite');

      let chunkSize = Math.min(MAX_CHUNK_SIZE, sectorData.end - pos + 1);

      message.setAddress(pos);
      message.setData(sectorData.buffer.readBytes(chunkSize, pos - sectorData.start));
      message.setErase(pos === sectorData.start);

      console.assert((message.data.limit - message.data.offset) === chunkSize, 'ERROR');

      promise = promise.then(() => {
        return client.writeToDevice(message)
          .then(() => {
            sectorData.buffer.reset();
            statusCallback({
              step: VerifyFlashSteps.writeRandomData,
              result: VerifyFlashResult.inProgress,
              sector: _.omit(sectorData, 'buffer'),
              location: pos,
              size: chunkSize,
              writeRandomData: {count: 1, max: 240},
            });

          });
      });
    }
    return promise;
  }

  private static fetchB64Assets(client: DeviceClient, sector: SectorData, statusCallback: StatusCallbackFunction): Promise<void> {
    if (!sector.ro) { return; }

    let challenge = new ByteBuffer(0);

    console.assert(challenge.limit === 0, "Challenge buffer size is wrong");

    let message: FlashHash = DeviceMessageHelper.factory('FlashHash');
    message.setAddress(sector.start);
    message.setChallenge(challenge);
    message.setLength(sector.size);

    return client.writeToDevice(message)
      .then((response: FlashHashResponse) => {
        statusCallback({
          step: VerifyFlashSteps.findB64Asset,
          result: VerifyFlashResult.inProgress,
          b64Asset: {count: 1, max: 3},
        });

        return VerifyFlashHashAction.findB64asset(sector, FlashBinaries, response);
      });
  }

  private static findB64asset(sector: SectorData, flashBinaries: object, response: FlashHashResponse): Promise<void> {
    let fingerprint = response.data.toHex();
    let promise = Promise.resolve();

    if (typeof flashBinaries !== 'object') { return promise; }

    Object.keys(flashBinaries).forEach((item) => {
      let expected = flashBinaries[item];
      if (expected.fingerprint === fingerprint) {
        sector.buffer = ByteBuffer.fromBase64(expected.b64_asset);
        return promise;
      }

      promise = promise.then(() => VerifyFlashHashAction.findB64asset(sector, expected, response));
    });

    return promise;
  }

  private static validateFlashContents(client: DeviceClient, challenge: ByteBuffer, expectedResponse: string): Promise<void> {
    console.assert(challenge.limit === CHALLENGE_SIZE, "Challenge buffer size is wrong");

    let message: FlashHash = DeviceMessageHelper.factory('FlashHash');
    message.setAddress(DeviceSectorProvider.getInstance().flashStart);
    message.setChallenge(challenge);
    message.setLength(DeviceSectorProvider.getInstance().flashSize);

    return client.writeToDevice(message)
      .then((response: FlashHashResponse) => {
        let actualResult = response.data.toHex();
        if (actualResult !== expectedResponse) {
          throw `Error: Flash hash mismatch for flash sectors\n  expected: ${expectedResponse}\n    actual: ${actualResult}`;
        }
      });
  }
}
