import {DeviceClient} from "../device-client";
import {Features} from "../global/features";
import * as Bitcore from "bitcore-lib";
import ByteBuffer = require('bytebuffer');
import {DeviceMessageHelper} from "../device-message-helper";
import FlashWrite = DeviceMessages.FlashWrite;

type SectorData = {
  start: number;
  end: number;
  buffer?: ByteBuffer;
}

export class VerifyFlashHash {
  private static sectors: Array<SectorData> = [
    {start: 0x08004000, end: 0x08007FFF},
    {start: 0x08008000, end: 0x0800BFFF},
    {start: 0x0800C000, end: 0x0800FFFF},
    {start: 0x08010000, end: 0x0801FFFF},
    // (0x080C0f32,0x080DFFFF),
    {start: 0x080E0000, end: 0x080FFFFF}
  ];

  private static initializeSectorTable() {
    VerifyFlashHash.sectors.forEach((sectorData: SectorData) => {
      let length = sectorData.end - sectorData.start;
      sectorData.buffer = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(length));
    });
  }

  public static operation(client: DeviceClient,
                          challenge?: ByteBuffer): Promise<any> {
    return client.featuresService.promise
      .then((features: Features) => {
        VerifyFlashHash.initializeSectorTable();

        if (!challenge) {
          challenge = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(32));
        }

        VerifyFlashHash.sectors.forEach((sectorData: SectorData) => {
          var message: FlashWrite = DeviceMessageHelper.factory('FlashWrite');
          message.setAddress(sectorData.start);
          message.setData(sectorData.buffer);
          message.setErase(false);
        });
      });
  }
}


// for (i=0 to 63) buffer[i] = fromCharCode()