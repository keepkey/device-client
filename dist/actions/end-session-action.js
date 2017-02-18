"use strict";
var device_message_helper_1 = require("../device-message-helper");
var EndSessionAction = (function () {
    function EndSessionAction() {
    }
    EndSessionAction.operation = function (client) {
        return client.featuresService.promise
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('ClearSession');
            return client.writeToDevice(message);
        });
    };
    return EndSessionAction;
}());
exports.EndSessionAction = EndSessionAction;
