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
const FlashBinaries = require('../../dist/flash-bin-dictionary.json');

export type SectorData = {
  name: string,
  start: number,
  end: number,
  ro?: boolean,
  buffer?: ByteBuffer,
}

export enum VerifyFlashSteps {
  starting,
  createRandomData,
  writeRandomData,
  sectorVerification,
  findB64Asset,
  hashSectors
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
  initializeCount?: VerifyFlashCount,
  writeRandomDataCount?: VerifyFlashCount,
  b64AssetCount?: VerifyFlashCount,
  hashSectorCount?: VerifyFlashCount,
}

export type StatusCallbackFunction = (message: VerifyFlashStatus) => Promise<void>;

const MAX_CHUNK_SIZE = 1024;
const CHALLENGE_SIZE = 32;
const FLASH_SIZE = 1048575;
const FLASH_START = 0x08000000;
const FLASH_END = 0x080FFFFF;
const MAX_BYTES_OF_ENTROPY_AVAILABLE = 65536;

export class VerifyFlashHashAction {
  private static sectors: Array<SectorData> = [
    {name: 'bootstrap', start: 0x08000000, end: 0x08003FFF, ro: true},
    {name: 'empty-sector-1', start: 0x08004000, end: 0x08007FFF},
    {name: 'empty-sector-2', start: 0x08008000, end: 0x0800BFFF},
    {name: 'data-sector', start: 0x0800C000, end: 0x0800FFFF},
    {name: 'empty-sector-4', start: 0x08010000, end: 0x0801FFFF},
    {name: 'bootloader', start: 0x08020000, end: 0x0805FFFF, ro: true},
    {name: 'mfr-firmware', start: 0x08060000, end: 0x080DFFFF, ro: true},
    {name: 'reserved-sector', start: 0x080E0000, end: 0x080FFFFF},
  ];

// flash memory layout:
// --------------------
//    name    |          range          |  size   |     function
// -----------+-------------------------+---------+------------------
//  Sector  0 | 0x08000000 - 0x08003FFF |  16 KiB | bootstrap code (Read Only)
//  Sector  1 | 0x08004000 - 0x08007FFF |  16 KiB | storage/config (Read/Write)
// -----------+-------------------------+---------+------------------
//  Sector  2 | 0x08008000 - 0x0800BFFF |  16 KiB | storage/config (Read/Write)
//  Sector  3 | 0x0800C000 - 0x0800FFFF |  16 KiB | storage/config (Read/Write)
// -----------+-------------------------+---------+------------------
//  Sector  4 | 0x08010000 - 0x0801FFFF |  64 KiB | empty (Read/Write)
//  Sector  5 | 0x08020000 - 0x0803FFFF | 128 KiB | bootloader code (Read Only)
//  Sector  6 | 0x08040000 - 0x0805FFFF | 128 KiB | bootloader code (Read Only)
//  Sector  7 | 0x08060000 - 0x0807FFFF | 128 KiB | application code(Read/Write)
// ===========+=========================+============================
//  Sector  8 | 0x08080000 - 0x0809FFFF | 128 KiB | application code (Read/Write)
//  Sector  9 | 0x080A0000 - 0x080BFFFF | 128 KiB | application code (Read/Write)
//  Sector 10 | 0x080C0000 - 0x080DFFFF | 128 KiB | application code (Read/Write)
//  Sector 11 | 0x080E0000 - 0x080FFFFF | 128 KiB | application code (Read/Write)

  public static operation(client: DeviceClient, statusCallback?: StatusCallbackFunction): Promise<any> {
    let protectedStatusCallback: StatusCallbackFunction = (...args) => statusCallback && statusCallback.apply(this, args);
    let flashBuffer = new ByteBuffer(FLASH_SIZE);
    return client.featuresService.promise
      .then((features: Features) => {
        protectedStatusCallback({
          step: VerifyFlashSteps.starting,
          result: VerifyFlashResult.inProgress,
        });
        let promise = Promise.resolve();
        VerifyFlashHashAction.sectors.forEach((sectorData: SectorData) => {
          let remaining = VerifyFlashHashAction.sectorLength(sectorData);
          sectorData.buffer = new ByteBuffer(remaining);

          protectedStatusCallback({
            step: VerifyFlashSteps.createRandomData,
            result: VerifyFlashResult.inProgress,
            sector: _.omit(sectorData, 'buffer'),

            // max is number of iterations, count is the amount to increment.
            initializeCount: {count: 1, max: 8},
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
        // Clean UP!!
        let challenge = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(CHALLENGE_SIZE));

        console.assert(challenge.limit === CHALLENGE_SIZE, "Challenge buffer size is wrong");

        var hash = sha3_256.create();
        hash.update(challenge.toArrayBuffer());
        VerifyFlashHashAction.sectors.forEach((sector) => {
          protectedStatusCallback({
            step: VerifyFlashSteps.hashSectors,
            result: VerifyFlashResult.inProgress,
            sector: _.omit(sector, 'buffer'),
            hashSectorCount: {count: 1, max: 8},
          });
          hash.update(sector.buffer.toArrayBuffer());
        });

        return {challenge: challenge, expectedHash: hash.hex()};
      })
      .then((obj) => {
        let result: VerifyFlashResult;
        return VerifyFlashHashAction.validateSector(client, obj.challenge, obj.expectedHash)
          .then(() => result = VerifyFlashResult.successful)
          .catch((msg) => {
            console.error(msg);
            result = VerifyFlashResult.failure;
          })
          .then(() => {
            protectedStatusCallback({
              step: VerifyFlashSteps.sectorVerification,
              result: result,
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
              writeRandomDataCount: {count: 1, max: 240},
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
    message.setLength(VerifyFlashHashAction.sectorLength(sector));

    return client.writeToDevice(message)
      .then((response: FlashHashResponse) => {
        statusCallback({
          step: VerifyFlashSteps.findB64Asset,
          result: VerifyFlashResult.inProgress,
          b64AssetCount: {count: 1, max: 3},
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
      console.log('sector name', sector.name);
      console.log('fingerprint device', fingerprint);
      console.log('fingerprint database', expected);
      if (expected['fingerprint'] === fingerprint) {
        sector.buffer = ByteBuffer.fromBase64(expected['b64_asset'])
        return promise;
      }

      promise = promise.then(() => VerifyFlashHashAction.findB64asset(sector, expected, response));
    });

    return promise;
  }

  private static validateSector(client: DeviceClient, challenge: ByteBuffer, expectedResponse: any): Promise<void> {
    let flashLength = FLASH_END - FLASH_START + 1;

    console.assert(challenge.limit === CHALLENGE_SIZE, "Challenge buffer size is wrong");

    let message: FlashHash = DeviceMessageHelper.factory('FlashHash');
    message.setAddress(FLASH_START);
    message.setChallenge(challenge);
    message.setLength(flashLength);

    return client.writeToDevice(message)
      .then((response: FlashHashResponse) => {
        let actualResult = response.data.toHex();
        if (actualResult !== expectedResponse) {
          throw `Error: Flash hash mismatch for flash sectors\n  expected: ${expectedResponse}\n    actual: ${actualResult}`;
        }
      });
  }

  // Use for debugging - REMOVE
  private static handleError(error): Promise<void> {
    console.log('Something went wrong.. Error!!!', error)
    return Promise.resolve();
  }

  private static sectorLength(sectorData) {
    return sectorData.end - sectorData.start + 1;
  }
}
