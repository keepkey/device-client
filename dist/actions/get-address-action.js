"use strict";
var device_message_helper_1 = require("../device-message-helper");
var action_helper_1 = require("./action-helper");
var GetAddressAction = (function () {
    function GetAddressAction() {
    }
    GetAddressAction.operation = function (client, addressN, coinName, showDisplay, multisig) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('GetAddress');
        message.setAddressN(addressN.toArray());
        message.setCoinName(coinName);
        message.setShowDisplay(showDisplay);
        if (multisig) {
            message.setMultisig(multisig);
        }
        return client.writeToDevice(message)
            .catch(action_helper_1.ActionHelper.ignoreCancelledAction);
    };
    return GetAddressAction;
}());
exports.GetAddressAction = GetAddressAction;
