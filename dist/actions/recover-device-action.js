"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var device_message_helper_1 = require("../device-message-helper");
var FailureCodes;
(function (FailureCodes) {
    FailureCodes[FailureCodes["Failure_ActionCancelled"] = 0] = "Failure_ActionCancelled";
})(FailureCodes || (FailureCodes = {}));
var RecoverDeviceAction = (function () {
    function RecoverDeviceAction() {
    }
    RecoverDeviceAction.operation = function (client, options) {
        var o = _.extend({}, RecoverDeviceAction.DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            if (!features.initialized) {
                o.use_character_cipher = features.supportsCipheredKeyRecovery;
                if (o.use_character_cipher) {
                    o.word_count = 0;
                }
                else {
                    o.word_count = features.defaultMnemonicSeedLength;
                }
                var message = device_message_helper_1.DeviceMessageHelper.factory('RecoveryDevice');
                message.setWordCount(o.word_count);
                message.setPassphraseProtection(o.passphrase_protection);
                message.setPinProtection(o.pin_protection);
                message.setLanguage(o.language);
                message.setLabel(o.label);
                message.setEnforceWordlist(o.enforce_wordlist);
                message.setUseCharacterCipher(o.use_character_cipher);
                return client.writeToDevice(message)
                    .catch(function (failureMessage) {
                    if (!FailureCodes[failureMessage.code]) {
                        return Promise.reject(failureMessage);
                    }
                });
            }
            else {
                return Promise.reject("Expected the device to be uninitialized");
            }
        })
            .catch(function (failure) {
            console.log('deviceRecovery failed', arguments);
            return Promise.reject(failure);
        });
    };
    RecoverDeviceAction.DEFAULT_OPTIONS = {
        passphrase_protection: false,
        pin_protection: true,
        language: null,
        label: null,
        word_count: 12,
        enforce_wordlist: true,
        use_character_cipher: true
    };
    return RecoverDeviceAction;
}());
exports.RecoverDeviceAction = RecoverDeviceAction;
