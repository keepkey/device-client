"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var device_message_helper_1 = require("../device-message-helper");
var ResetDeviceAction = (function () {
    function ResetDeviceAction() {
    }
    ResetDeviceAction.operation = function (client, options) {
        return client.featuresService.promise
            .then(function (features) {
            if (!features.initialized) {
                var o = _.extend({}, ResetDeviceAction.DEFAULT_OPTIONS, options);
                var message = device_message_helper_1.DeviceMessageHelper.factory('ResetDevice');
                message.setDisplayRandom(o.display_random);
                message.setStrength(o.strength ||
                    ResetDeviceAction.wordCount2KeyStrength(features.defaultMnemonicSeedLength) || 128);
                message.setPassphraseProtection(o.passphrase_protection);
                message.setPinProtection(o.pin_protection);
                message.setLanguage(o.language);
                message.setLabel(o.label);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('Expected device to be uninitialized. Run WipeDevice and try again.');
            }
        });
    };
    ResetDeviceAction.wordCount2KeyStrength = function (wc) {
        switch (wc) {
            case 12: return 128;
            case 18: return 192;
            case 24: return 256;
            default: return 0;
        }
    };
    ResetDeviceAction.DEFAULT_OPTIONS = {
        display_random: false,
        passphrase_protection: false,
        pin_protection: true,
        language: 'english',
        label: null
    };
    return ResetDeviceAction;
}());
exports.ResetDeviceAction = ResetDeviceAction;
