"use strict";
var _ = require("lodash");
var message_states_1 = require("./message-states");
var message_states_2 = require("./message-states");
var message_states_3 = require("./message-states");
var DeviceMessageStates = (function () {
    function DeviceMessageStates() {
    }
    DeviceMessageStates.isInterstitialMessage = function (lastMessage, message) {
        return lastMessage.interstitialMessages &&
            (_.indexOf(lastMessage.interstitialMessages, message) !== -1);
    };
    DeviceMessageStates.getHostMessageState = function (name) {
        return message_states_2.MessageStates.getMessageState(message_states_1.MessageSender.host, message_states_3.MessageDirection.request, name);
    };
    DeviceMessageStates.getDeviceMessageState = function (name) {
        return message_states_2.MessageStates.getMessageState(message_states_1.MessageSender.device, message_states_3.MessageDirection.request, name);
    };
    return DeviceMessageStates;
}());
DeviceMessageStates.Cancel = 'Cancel';
DeviceMessageStates.TxRequest = 'TxRequest';
DeviceMessageStates.EthereumTxRequest = 'EthereumTxRequest';
exports.DeviceMessageStates = DeviceMessageStates;
