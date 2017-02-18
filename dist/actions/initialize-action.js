"use strict";
var device_message_helper_1 = require("../device-message-helper");
var InitializeAction = (function () {
    function InitializeAction() {
    }
    InitializeAction.operation = function (client) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('Initialize');
        return client.writeToDevice(message)
            .then(function (featuresMessage) {
            client.featuresService.setValue(featuresMessage);
            return client.featuresService.promise;
        });
    };
    return InitializeAction;
}());
exports.InitializeAction = InitializeAction;
