"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ByteBuffer = require("bytebuffer");
var node_vector_1 = require("../node-vector");
var device_message_helper_1 = require("../device-message-helper");
var buffer_helper_1 = require("../global/buffer-helper");
var DEFAULT_OPTIONS = {
    addressN: new node_vector_1.NodeVector([]),
    message: ByteBuffer.wrap(''),
    publicKey: ByteBuffer.wrap(''),
    displayOnly: false,
    coinName: 'Bitcoin'
};
var EncryptMessageAction = (function () {
    function EncryptMessageAction() {
    }
    EncryptMessageAction.operation = function (client, options) {
        var o = _.extend({}, DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            if (features.initialized) {
                var message = device_message_helper_1.DeviceMessageHelper.factory('EncryptMessage');
                message.setPubkey(buffer_helper_1.BufferHelper.pad(o.publicKey, 33));
                message.setMessage(o.message);
                message.setDisplayOnly(o.displayOnly);
                message.setAddressN(node_vector_1.NodeVector.fromString(options.addressN).toArray());
                message.setCoinName(o.coinName);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('encryptMessage: device not initialized');
            }
        });
    };
    return EncryptMessageAction;
}());
exports.EncryptMessageAction = EncryptMessageAction;
