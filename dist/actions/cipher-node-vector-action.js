"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ByteBuffer = require("bytebuffer");
var cipher_key_value_action_1 = require("./cipher-key-value-action");
var node_vector_1 = require("../node-vector");
exports.NODE_VECTOR_ENCYPTION_KEY = 'node-location';
var ROOT_NODE_VECTOR = new node_vector_1.NodeVector([]);
var CipherNodeVectorAction = (function () {
    function CipherNodeVectorAction() {
    }
    CipherNodeVectorAction.operation = function (client, encrypt, nodeVector) {
        var value = encrypt ? node_vector_1.NodeVector.fromString(nodeVector).toBuffer()
            : ByteBuffer.fromHex(nodeVector);
        return cipher_key_value_action_1.CipherKeyValueAction.operation(client, encrypt, ROOT_NODE_VECTOR, exports.NODE_VECTOR_ENCYPTION_KEY, value, false, false)
            .then(function (response) {
            return encrypt ? response.value.toHex() : node_vector_1.NodeVector.fromBuffer(response.value);
        });
    };
    return CipherNodeVectorAction;
}());
exports.CipherNodeVectorAction = CipherNodeVectorAction;
