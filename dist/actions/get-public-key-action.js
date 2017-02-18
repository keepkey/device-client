"use strict";
var node_vector_1 = require("../node-vector");
var device_message_helper_1 = require("../device-message-helper");
var GetPublicKeyAction = (function () {
    function GetPublicKeyAction() {
    }
    GetPublicKeyAction.operation = function (client, addressN, showDisplay) {
        return client.featuresService.promise
            .then(function (features) {
            if (features.initialized) {
                var message = device_message_helper_1.DeviceMessageHelper.factory('GetPublicKey');
                message.setAddressN(node_vector_1.NodeVector.fromString(addressN).toArray());
                message.setShowDisplay(showDisplay);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('getPublicKey: device not initialized');
            }
        });
    };
    return GetPublicKeyAction;
}());
exports.GetPublicKeyAction = GetPublicKeyAction;
