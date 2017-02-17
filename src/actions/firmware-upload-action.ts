/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import ByteBuffer = require('bytebuffer');
import {DeviceClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import FirmwareUpload = DeviceMessages.FirmwareUpload;
import FirmwareErase = DeviceMessages.FirmwareErase;
import {Features} from "../global/features";
import * as Bitcore from "bitcore-lib";
import concat = require("concat-stream");

export class FirmwareUploadAction {
  private static firmwareFileMetaData: FirmwareFileMetadata = require('../../dist/keepkey_main.json');

  private static client: DeviceClient;
  private static payload: ArrayBuffer;

  public static operation(client: DeviceClient): Promise<void> {
    FirmwareUploadAction.client = client;
    console.log('starting firmware upload');
    return client.featuresService.promise
      .then<string>(FirmwareUploadAction.checkDeviceInBootloaderMode)
      .then<void>((): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
          client.rawFirmwareStreamFactory()
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
      "firmware payload digest",
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
