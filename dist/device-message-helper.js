"use strict";
var _ = require("lodash");
var ByteBuffer = require("bytebuffer");
var Long = require("long");
var DeviceMessageHelper = (function () {
    function DeviceMessageHelper() {
    }
    DeviceMessageHelper.factory = function (MessageType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new (Function.prototype.bind.apply(DeviceMessageHelper.messageFactories[MessageType], args));
    };
    DeviceMessageHelper.decode = function (messageType, message) {
        return DeviceMessageHelper.messageFactories[messageType].decode(message);
    };
    DeviceMessageHelper.hydrate = function (pbMessage) {
        var objReflection = pbMessage.$type;
        var newMessage = _.cloneDeepWith(pbMessage, function (value) {
            if (ByteBuffer.isByteBuffer(value)) {
                return value;
            }
        });
        var enumFields = _.filter(objReflection._fields, function (it) {
            return it.resolvedType && it.resolvedType.className === 'Enum';
        });
        _.each(enumFields, function (it) {
            var value = pbMessage[it.name];
            var match = _.find(it.resolvedType.children, { id: value });
            newMessage[it.name] = match.name;
        });
        newMessage.typeName = pbMessage.$type.name;
        return newMessage;
    };
    DeviceMessageHelper.toPrintable = function (pbMessage) {
        return JSON.stringify(DeviceMessageHelper.hydrate(pbMessage), DeviceMessageHelper.buffer2Hex, 4);
    };
    DeviceMessageHelper.buffer2Hex = function (key, value) {
        if (key === 'passphrase' || key === 'pin') {
            return '<redacted>';
        }
        else if (value && value.buffer) {
            if (value.buffer instanceof Buffer) {
                return value.toHex();
            }
            var hexstring = '';
            if (value.limit > 1000) {
                return '<long buffer suppressed>';
            }
            for (var i = value.offset; i < value.limit; i++) {
                if (value.view[i] < 16) {
                    hexstring += 0;
                }
                hexstring += value.view[i].toString(16);
            }
            return hexstring;
        }
        else if (value && !_.isUndefined(value.low) && !_.isUndefined(value.high) && !_.isUndefined(value.unsigned)) {
            return (new Long(value.low, value.high, value.unsigned)).toString();
        }
        else {
            return value;
        }
    };
    DeviceMessageHelper.getSelectedResponse = function (signedResponse) {
        var responseV1 = signedResponse.getResponse();
        var responseV2 = signedResponse.getResponseV2();
        if (responseV1 && responseV2) {
            throw 'Invalid signed response. Both V1 and V2 responses returned';
        }
        else if (!responseV1 && !responseV2) {
            throw 'Invalid signed response. No response returned';
        }
        return responseV1 || responseV2;
    };
    return DeviceMessageHelper;
}());
DeviceMessageHelper.messageFactories = require('../dist/messages.js');
exports.DeviceMessageHelper = DeviceMessageHelper;
