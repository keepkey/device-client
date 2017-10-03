"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ByteBuffer = require("bytebuffer");
var purpose_code_helper_1 = require("./purpose-code-helper");
var HARDENED_NODE_FLAG = 0x80000000;
var EXTENDED_PURPOSE_FLAG = 0x40000000;
var NodeVector = (function () {
    function NodeVector(args) {
        this._value = _.clone(args);
    }
    NodeVector.fromString = function (addressN) {
        if (!addressN) {
            return null;
        }
        if (addressN instanceof NodeVector) {
            return addressN;
        }
        var nodeVectorStrings = addressN.toUpperCase().split('/');
        if (nodeVectorStrings[0] === 'M') {
            nodeVectorStrings = nodeVectorStrings.slice(1);
        }
        var result = [];
        _.transform(nodeVectorStrings, NodeVector.convertNodeStringToNumber, result);
        return new NodeVector(result);
    };
    NodeVector.fromBuffer = function (buffer) {
        var vectorArray = [];
        buffer.BE();
        var length = buffer.readUint8();
        for (var i = 0; i < length; i++) {
            vectorArray.push(buffer.readUint32());
        }
        return new NodeVector(vectorArray);
    };
    NodeVector.join = function (vectors) {
        return _.reduce(vectors, function (result, vector) { return result.join(NodeVector.fromString(vector)); }, new NodeVector([]));
    };
    NodeVector.convertNodeStringToNumber = function (result, nodeString) {
        if (nodeString.substring(nodeString.length - 1) === "'") {
            nodeString = '-' + nodeString.substring(0, nodeString.length - 1);
        }
        var value = parseInt(nodeString, 10);
        if (isNaN(value)) {
            value = purpose_code_helper_1.ExtendedPurposeCodeHelper.encode(nodeString);
        }
        else if (value < 0) {
            value = (Math.abs(value) | HARDENED_NODE_FLAG) >>> 0;
        }
        if (nodeString === '-0') {
            result.push(HARDENED_NODE_FLAG);
        }
        else {
            result.push(value);
        }
        return result;
    };
    ;
    NodeVector.prototype.join = function (o) {
        if (o) {
            var vector = NodeVector.fromString(o);
            return new NodeVector(this._value.concat(vector.toArray()));
        }
        else {
            return new NodeVector(this._value);
        }
    };
    NodeVector.prototype.toString = function () {
        var converted = ['m'];
        this._value.forEach(function (it) {
            if (it & HARDENED_NODE_FLAG) {
                if (it & EXTENDED_PURPOSE_FLAG) {
                    converted.push(purpose_code_helper_1.ExtendedPurposeCodeHelper.decode(it));
                }
                else {
                    converted.push((it ^ HARDENED_NODE_FLAG) + '\'');
                }
            }
            else {
                converted.push(it.toString());
            }
        });
        return converted.join('/');
    };
    NodeVector.prototype.toArray = function () {
        return this._value;
    };
    NodeVector.prototype.toBuffer = function () {
        var nodeVectorDepth = this._value.length;
        var buffer = ByteBuffer.allocate(nodeVectorDepth * 4 + 1).BE();
        buffer.writeUint8(nodeVectorDepth);
        this._value.forEach(function (node) {
            buffer.writeUint32(node);
        });
        buffer.reset();
        return buffer;
    };
    return NodeVector;
}());
exports.NodeVector = NodeVector;
