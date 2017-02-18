"use strict";
var _ = require("lodash");
var ByteBuffer = require("bytebuffer");
var node_vector_1 = require("../node-vector");
var device_message_helper_1 = require("../device-message-helper");
var DEFAULT_OPTIONS = {
    addressN: new node_vector_1.NodeVector([]),
    message: ByteBuffer.wrap(''),
    coinName: 'Bitcoin'
};
var SignMessageAction = (function () {
    function SignMessageAction() {
    }
    SignMessageAction.operation = function (client, options) {
        var o = _.extend({}, DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            if (features.initialized) {
                var message = device_message_helper_1.DeviceMessageHelper.factory('SignMessage');
                message.setAddressN(node_vector_1.NodeVector.fromString(o.addressN).toArray());
                message.setMessage(o.message);
                message.setCoinName(o.coinName);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('signMessage: device not initialized');
            }
        });
    };
    return SignMessageAction;
}());
exports.SignMessageAction = SignMessageAction;
