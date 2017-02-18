"use strict";
var device_message_helper_1 = require("./device-message-helper");
var Bitcore = require("bitcore-lib");
var ByteBuffer = require("bytebuffer");
var EntropyRequestMessageHandler = (function () {
    function EntropyRequestMessageHandler() {
    }
    EntropyRequestMessageHandler.prototype.messageHandler = function (request) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('EntropyAck');
        var randomBytes = ByteBuffer.wrap(Bitcore.crypto.Random.getRandomBuffer(32));
        message.setEntropy(randomBytes);
        return message;
    };
    return EntropyRequestMessageHandler;
}());
EntropyRequestMessageHandler.messageNames = ['EntropyRequest'];
exports.EntropyRequestMessageHandler = EntropyRequestMessageHandler;
