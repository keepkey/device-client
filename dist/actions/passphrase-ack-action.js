"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("../device-message-helper");
var PassphraseAckAction = (function () {
    function PassphraseAckAction() {
    }
    PassphraseAckAction.operation = function (client, passphrase) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('PassphraseAck');
        message.setPassphrase(passphrase);
        return client.writeToDevice(message)
            .catch(function () {
            console.log('failure while sending passphrase');
        });
    };
    return PassphraseAckAction;
}());
exports.PassphraseAckAction = PassphraseAckAction;
