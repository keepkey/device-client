"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("../device-message-helper");
var WipeDeviceAction = (function () {
    function WipeDeviceAction() {
    }
    WipeDeviceAction.operation = function (client) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('WipeDevice');
        return client.writeToDevice(message)
            .then(function (response) {
            client.featuresService.clear();
        });
    };
    return WipeDeviceAction;
}());
exports.WipeDeviceAction = WipeDeviceAction;
