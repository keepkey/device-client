"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("../device-message-helper");
var CancelAction = (function () {
    function CancelAction() {
    }
    CancelAction.operation = function (client) {
        return client.featuresService.promise
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('Cancel');
            return client.writeToDevice(message);
        });
    };
    return CancelAction;
}());
exports.CancelAction = CancelAction;
