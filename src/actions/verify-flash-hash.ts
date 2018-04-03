import {DeviceClient} from "../device-client";
import {Features} from "../global/features";
import * as Bitcore from "bitcore-lib";
import ByteBuffer = require('bytebuffer');
import {DeviceMessageHelper} from "../device-message-helper";
import FlashWrite = DeviceMessages.FlashWrite;
import FlashHash = DeviceMessages.FlashHash;
import FlashHashResponse = DeviceMessages.FlashHashResponse;

type SectorData = {
  start: number;
  end: number;
  buffer?: ByteBuffer;
}

const CHUNK_SIZE = 64;
const CHALLENGE_SIZE = 32;

export class VerifyFlashHash {
  private static sectors: Array<SectorData> = [
    {start: 0x08004000, end: 0x08007FFF},
    {start: 0x08008000, end: 0x0800BFFF},
    {start: 0x0800C000, end: 0x0800FFFF},
    {start: 0x08010000, end: 0x0801FFFF},
    // (0x080C0f32,0x080DFFFF),
    {start: 0x080E0000, end: 0x080FFFFF}
  ];

  public static operation(client: DeviceClient,
                          challenge?: ByteBuffer): Promise<any> {
    return client.featuresService.promise
      .then((features: Features) => {
        if (!challenge) {

          challenge = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(CHALLENGE_SIZE));
        }

        let promise = Promise.resolve();
        VerifyFlashHash.sectors.forEach((sectorData: SectorData) => {
          let length = VerifyFlashHash.sectorLenth(sectorData);
          sectorData.buffer = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(length));
          promise = promise.then(() => VerifyFlashHash.writeSector(client, sectorData));
        });
        return promise;
      })
      .then(() => {
        VerifyFlashHash.sectors.forEach((sectorData: SectorData) =>
          VerifyFlashHash.validateRWSector(client, sectorData, challenge));
      });
  }

  private static writeSector(client: DeviceClient, sectorData: SectorData): Promise<any> {
    let promise = Promise.resolve();

    for (let pos = sectorData.start; pos += CHUNK_SIZE; pos >= sectorData.end) {
      let message: FlashWrite = DeviceMessageHelper.factory('FlashWrite');

      message.setAddress(pos);
      message.setData(sectorData.buffer.readBytes(CHUNK_SIZE, pos));
      message.setErase(false);

      promise = promise.then(() => client.writeToDevice(message));
    }
    return promise;
  }

  private static validateRWSector(client: DeviceClient, sector: SectorData, challenge: ByteBuffer) {
    let dataToHash: ByteBuffer = new ByteBuffer(CHALLENGE_SIZE + VerifyFlashHash.sectorLenth(sector));

    console.assert(challenge.capacity() === CHALLENGE_SIZE, "Challenge buffer size is wrong");
    console.assert(sector.buffer === VerifyFlashHash.sectorLenth(sector), "sector data buffer size is wrong");

    dataToHash
      .append(challenge)
      .append(sector.buffer);

    let expectedResponse = ByteBuffer.wrap(
      Bitcore.crypto.Hash.sha256(dataToHash.toBuffer())).toHex();

    let message: FlashHash = DeviceMessageHelper.factory('FlashHash');
    message.setAddress(sector.start);
    message.setChallenge(challenge);
    message.setLength(VerifyFlashHash.sectorLenth(sector));

    return client.writeToDevice(message)
      .then((response: FlashHashResponse) => {
        let actualResult = response.data.toHex();

        if (actualResult !== expectedResponse) {
          throw `Error: Flash hash mismatch for sector ${sector.start}`;
        }
      })
  }

  private static sectorLenth(sectorData) {
    return sectorData.end - sectorData.start;
  }
}
