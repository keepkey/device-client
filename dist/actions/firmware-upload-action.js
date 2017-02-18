"use strict";
var ByteBuffer = require("bytebuffer");
var device_message_helper_1 = require("../device-message-helper");
var Bitcore = require("bitcore-lib");
var concat = require("concat-stream");
var FirmwareUploadAction = (function () {
    function FirmwareUploadAction() {
    }
    FirmwareUploadAction.operation = function (client) {
        FirmwareUploadAction.client = client;
        console.log('starting firmware upload');
        return client.featuresService.promise
            .then(FirmwareUploadAction.checkDeviceInBootloaderMode)
            .then(function () {
            return new Promise(function (resolve, reject) {
                client.rawFirmwareStreamFactory()
                    .on('error', function (err) {
                    console.error(err);
                    reject(err);
                })
                    .pipe(concat(function (firmwareBuffer) {
                    FirmwareUploadAction.payload = firmwareBuffer;
                    resolve();
                }));
            });
        })
            .then(FirmwareUploadAction.validateFirmwareFileSize)
            .then(FirmwareUploadAction.validateFirmwarePayloadDigest)
            .then(FirmwareUploadAction.validateFirmwareImageDigest)
            .then(FirmwareUploadAction.verifyManufacturerPrefixInFirmwareImage)
            .then(FirmwareUploadAction.eraseFirmware)
            .then(FirmwareUploadAction.sendFirmwareToDevice);
    };
    FirmwareUploadAction.checkDeviceInBootloaderMode = function (features) {
        console.log('check for device in bootloader mode');
        if (!features.bootloaderMode) {
            return Promise.reject('Device must be in bootloader mode');
        }
        else {
            return Promise.resolve(FirmwareUploadAction.firmwareFileMetaData.file);
        }
    };
    FirmwareUploadAction.validateFirmwareFileSize = function () {
        if (FirmwareUploadAction.payload.byteLength !== FirmwareUploadAction.firmwareFileMetaData.size) {
            return Promise.reject("Size of firmware file (" + FirmwareUploadAction.payload.byteLength + ") doesn't match the expected size of " + FirmwareUploadAction.firmwareFileMetaData.size);
        }
        else {
            return Promise.resolve();
        }
    };
    FirmwareUploadAction.checkHash = function (hash, hashName, expectedHash) {
        var hexHash = ByteBuffer.wrap(hash).toHex();
        console.log('verifying %s: expecting %s', hashName, expectedHash);
        console.log(hashName + ":", hexHash);
        if (hexHash !== expectedHash) {
            return Promise.reject("Hash " + hashName + " doesn't match expected value");
        }
        else {
            return Promise.resolve();
        }
    };
    FirmwareUploadAction.validateFirmwarePayloadDigest = function () {
        return FirmwareUploadAction.checkHash(Bitcore.crypto.Hash.sha256(Buffer.from(FirmwareUploadAction.payload.slice(256))), "firmware payload digest", FirmwareUploadAction.firmwareFileMetaData.trezorDigest);
    };
    FirmwareUploadAction.validateFirmwareImageDigest = function () {
        return FirmwareUploadAction.checkHash(Bitcore.crypto.Hash.sha256(Buffer.from(FirmwareUploadAction.payload)), "firmware payload digest", FirmwareUploadAction.firmwareFileMetaData.digest);
    };
    FirmwareUploadAction.verifyManufacturerPrefixInFirmwareImage = function () {
        console.log('verifying manufacturers prefix in firmware file');
        var firmwareManufacturerTag = ByteBuffer
            .wrap(FirmwareUploadAction.payload.slice(0, 4))
            .toString('utf8');
        if (firmwareManufacturerTag === 'KPKY') {
            return Promise.resolve();
        }
        else {
            return Promise.reject('Firmware image is from an unknown manufacturer. Unable to upload to the device.');
        }
    };
    FirmwareUploadAction.sendFirmwareToDevice = function () {
        console.log('sending firmware to device');
        var message = device_message_helper_1.DeviceMessageHelper.factory('FirmwareUpload');
        message.setPayload(ByteBuffer.wrap(FirmwareUploadAction.payload));
        message.setPayloadHash(ByteBuffer.fromHex(FirmwareUploadAction.firmwareFileMetaData.digest));
        return FirmwareUploadAction.client.writeToDevice(message);
    };
    FirmwareUploadAction.eraseFirmware = function () {
        console.log('erasing firmware');
        var message = device_message_helper_1.DeviceMessageHelper.factory('FirmwareErase');
        return FirmwareUploadAction.client.writeToDevice(message);
    };
    return FirmwareUploadAction;
}());
FirmwareUploadAction.firmwareFileMetaData = require('../../dist/keepkey_main.json');
exports.FirmwareUploadAction = FirmwareUploadAction;
