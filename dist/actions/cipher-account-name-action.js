"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ByteBuffer = require("bytebuffer");
var cipher_key_value_action_1 = require("./cipher-key-value-action");
var node_vector_1 = require("../node-vector");
var ACCOUNT_NAME_ENCYPTION_KEY = 'node-location';
var CipherAccountNameAction = (function () {
    function CipherAccountNameAction() {
    }
    CipherAccountNameAction.operation = function (client, encrypt, nodePath, value) {
        var valueBuffer = encrypt ? ByteBuffer.wrap(value) : ByteBuffer.fromHex(value);
        return cipher_key_value_action_1.CipherKeyValueAction.operation(client, encrypt, node_vector_1.NodeVector.fromString(nodePath), ACCOUNT_NAME_ENCYPTION_KEY, valueBuffer, false, false)
            .then(function (response) {
            return encrypt ? response.value.toHex() : response.value.toUTF8().replace(/\0/g, '');
        });
    };
    return CipherAccountNameAction;
}());
exports.CipherAccountNameAction = CipherAccountNameAction;
