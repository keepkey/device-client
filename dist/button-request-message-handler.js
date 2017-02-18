"use strict";
var device_message_helper_1 = require("./device-message-helper");
var ButtonRequestMessageHandler = (function () {
    function ButtonRequestMessageHandler() {
    }
    ButtonRequestMessageHandler.prototype.messageHandler = function (request) {
        return device_message_helper_1.DeviceMessageHelper.factory('ButtonAck');
    };
    return ButtonRequestMessageHandler;
}());
ButtonRequestMessageHandler.messageNames = ['ButtonRequest'];
exports.ButtonRequestMessageHandler = ButtonRequestMessageHandler;
