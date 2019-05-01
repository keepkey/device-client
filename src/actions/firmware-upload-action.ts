import * as _ from 'lodash';
import ByteBuffer = require('bytebuffer');
import {DeviceClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import FirmwareUpload = DeviceMessages.FirmwareUpload;
import FirmwareErase = DeviceMessages.FirmwareErase;
import {Features} from "../global/features";
import * as Bitcore from "bitcore-lib";
import concat = require("concat-stream");

const FIRMWARE_METADATA_FILE: Array<FirmwareFileMetadata> = require('../../dist/firmware.json');

export class FirmwareUploadAction {
  private static firmwareFileMetaData: FirmwareFileMetadata;

  private static client: DeviceClient;
  private static payload: ArrayBuffer;

  public static operation(client: DeviceClient, firmwareId: string): Promise<void> {
    let modelNumber: string;
    if (!client.rawFirmwareStreamFactory) {
      throw 'firmware stream factory required to upload firmware';
    }
    FirmwareUploadAction.client = client;
    console.log('starting firmware upload');
    return client.featuresService.promise
      .then((features) => {
        if (firmwareId === 'bootloaderUpdater') {
          FirmwareUploadAction.firmwareFileMetaData = _.find(FIRMWARE_METADATA_FILE, {isBootloaderUpdater: true});
          console.assert(FirmwareUploadAction.firmwareFileMetaData, `Bootloader updater metadata not found`);
        } else {
          console.assert(features.model, "Device model number not available from the device feature object");
          modelNumber = features.model;
          FirmwareUploadAction.firmwareFileMetaData = _.find(FIRMWARE_METADATA_FILE, {isBootloaderUpdater: false, version: firmwareId});
          console.assert(FirmwareUploadAction.firmwareFileMetaData, `${firmwareId} firmware metadata not found for ${modelNumber}`);
        }
        console.log(`Installing ${FirmwareUploadAction.firmwareFileMetaData.file} version ${FirmwareUploadAction.firmwareFileMetaData.version}`);
        return features;
      })
      .then<string>(FirmwareUploadAction.checkDeviceInBootloaderMode)
      .then<void>((): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
          client.rawFirmwareStreamFactory(FirmwareUploadAction.firmwareFileMetaData.file)
            .on('error', (err: Error) => {
              console.error(err);
              reject(err);
            })
            .pipe(concat((firmwareBuffer) => {
              FirmwareUploadAction.payload = firmwareBuffer;
              resolve();
            }));
        });

      })
      .then<void>(FirmwareUploadAction.validateFirmwareFileSize)
      .then<void>(FirmwareUploadAction.validateFirmwarePayloadDigest)
      .then<void>(FirmwareUploadAction.validateFirmwareImageDigest)
      .then<void>(FirmwareUploadAction.verifyManufacturerPrefixInFirmwareImage)
      .then<void>(FirmwareUploadAction.eraseFirmware)
      .then<void>(FirmwareUploadAction.sendFirmwareToDevice);
  }

  private static checkDeviceInBootloaderMode(features: Features): Promise<string> {
    console.log('check for device in bootloader mode');
    if (!features.bootloaderMode) {
      return Promise.reject('Device must be in bootloader mode');
    } else {
      return Promise.resolve(FirmwareUploadAction.firmwareFileMetaData.file);
    }
  }

  private static validateFirmwareFileSize(): Promise<void> {
    if (FirmwareUploadAction.payload.byteLength !== FirmwareUploadAction.firmwareFileMetaData.size) {
      return Promise.reject(
        `Size of firmware file (${FirmwareUploadAction.payload.byteLength}) doesn't match the expected size of ${FirmwareUploadAction.firmwareFileMetaData.size}`);
    } else {
      return Promise.resolve();
    }
  }

  private static checkHash(hash, hashName, expectedHash): Promise < void > {
    var hexHash = ByteBuffer.wrap(hash).toHex();
    console.log('verifying %s: expecting %s', hashName, expectedHash);
    console.log(hashName + ":", hexHash);
    if (hexHash !== expectedHash) {
      return Promise.reject(`Hash ${hashName} doesn't match expected value`);
    } else {
      return Promise.resolve();
    }
  }

  private static validateFirmwarePayloadDigest(): Promise<void> {
    return FirmwareUploadAction.checkHash(
      Bitcore.crypto.Hash.sha256(Buffer.from(FirmwareUploadAction.payload.slice(256))),
      "firmware payload digest",
      FirmwareUploadAction.firmwareFileMetaData.trezorDigest
    );
  }

  private static validateFirmwareImageDigest(): Promise<void> {
    return FirmwareUploadAction.checkHash(
      Bitcore.crypto.Hash.sha256(Buffer.from(FirmwareUploadAction.payload)),
      "firmware file digest",
      FirmwareUploadAction.firmwareFileMetaData.digest
    );
  }

  private static verifyManufacturerPrefixInFirmwareImage(): Promise<any> {
    console.log('verifying manufacturers prefix in firmware file');

    var firmwareManufacturerTag = ByteBuffer
      .wrap(FirmwareUploadAction.payload.slice(0, 4))
      .toString('utf8');
    if (firmwareManufacturerTag === 'KPKY') {
      return Promise.resolve();
    } else {
      return Promise.reject(
        'Firmware image is from an unknown manufacturer. Unable to upload to the device.');
    }
  }

  private static sendFirmwareToDevice(): Promise<any> {
    console.log('sending firmware to device');

    var message: FirmwareUpload = DeviceMessageHelper.factory('FirmwareUpload');
    message.setPayload(ByteBuffer.wrap(FirmwareUploadAction.payload));
    message.setPayloadHash(
      ByteBuffer.fromHex(FirmwareUploadAction.firmwareFileMetaData.digest));

    return FirmwareUploadAction.client.writeToDevice(message);
  }

  private static eraseFirmware() {
    console.log('erasing firmware');
    var message: FirmwareErase = DeviceMessageHelper.factory('FirmwareErase');
    return FirmwareUploadAction.client.writeToDevice(message);
  }
}
