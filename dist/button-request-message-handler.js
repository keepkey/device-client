"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("./device-message-helper");
var ButtonRequestMessageHandler = (function () {
    function ButtonRequestMessageHandler() {
    }
    ButtonRequestMessageHandler.prototype.messageHandler = function (request) {
        return device_message_helper_1.DeviceMessageHelper.factory('ButtonAck');
    };
    ButtonRequestMessageHandler.messageNames = ['ButtonRequest'];
    return ButtonRequestMessageHandler;
}());
exports.ButtonRequestMessageHandler = ButtonRequestMessageHandler;
