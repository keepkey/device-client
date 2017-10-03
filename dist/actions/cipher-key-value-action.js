"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("../device-message-helper");
var buffer_helper_1 = require("../global/buffer-helper");
var CipherKeyValueAction = (function () {
    function CipherKeyValueAction() {
    }
    CipherKeyValueAction.operation = function (client, encrypt, addressN, key, value, askOnEncrypt, askOnDecrypt) {
        return client.featuresService.promise
            .then(function (features) {
            if (features.initialized) {
                var message = device_message_helper_1.DeviceMessageHelper.factory('CipherKeyValue');
                message.setAddressN(addressN.toArray());
                message.setKey(key);
                message.setValue(buffer_helper_1.BufferHelper.pad(value, 16));
                message.setEncrypt(encrypt);
                message.setAskOnEncrypt(askOnEncrypt);
                message.setAskOnDecrypt(askOnDecrypt);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('encryptKeyValue: device not initialized');
            }
        });
    };
    return CipherKeyValueAction;
}());
exports.CipherKeyValueAction = CipherKeyValueAction;
