"use strict";
var device_message_helper_1 = require("../device-message-helper");
var action_helper_1 = require("./action-helper");
var GetEthereumAddressAction = (function () {
    function GetEthereumAddressAction() {
    }
    GetEthereumAddressAction.operation = function (client, addressN, showDisplay) {
        var message = device_message_helper_1.DeviceMessageHelper.factory('EthereumGetAddress');
        message.setAddressN(addressN.toArray());
        message.setShowDisplay(showDisplay);
        return client.writeToDevice(message)
            .catch(action_helper_1.ActionHelper.ignoreCancelledAction);
    };
    return GetEthereumAddressAction;
}());
exports.GetEthereumAddressAction = GetEthereumAddressAction;
