"use strict";
var ByteBuffer = require("bytebuffer");
var OLD_MESSAGE_HEADER_START = '##';
var MESSAGE_HEADER_START = String.fromCharCode(0x3f) + '##';
var Transport = (function () {
    function Transport(deviceData) {
        this.deviceData = deviceData;
        this.deviceInUse = false;
        this.messageMaps = {};
        this.pendingWriteQueue = Promise.resolve();
    }
    Object.defineProperty(Transport.prototype, "deviceId", {
        get: function () {
            return this.deviceData.deviceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "vendorId", {
        get: function () {
            return this.deviceData.vendorId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "productId", {
        get: function () {
            return this.deviceData.productId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "hasReportId", {
        get: function () {
            return this.deviceData.maxInputReportSize !== 63;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "reportId", {
        get: function () {
            return this.hasReportId ? 0 : 63;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transport.prototype, "messageHeaderStart", {
        get: function () {
            return this.hasReportId ? MESSAGE_HEADER_START : OLD_MESSAGE_HEADER_START;
        },
        enumerable: true,
        configurable: true
    });
    Transport.prototype.setMessageMap = function (deviceType, proto) {
        var msgClass = '', currentMsgClass = '';
        if (!this.messageMaps.hasOwnProperty(deviceType)) {
            this.messageMaps[deviceType] = {
                msgTypeToClass: {},
                msgClassToType: {}
            };
            for (msgClass in proto.MessageType) {
                if (proto.MessageType.hasOwnProperty(msgClass)) {
                    currentMsgClass = msgClass.replace('MessageType_', '');
                    this.messageMaps[deviceType].msgClassToType[currentMsgClass] =
                        proto.MessageType[msgClass];
                    this.messageMaps[deviceType].msgTypeToClass[proto.MessageType[msgClass]] =
                        currentMsgClass;
                }
            }
        }
        this.messageMap = this.messageMaps[deviceType];
        this.protoBuf = proto;
    };
    Transport.prototype.write = function (txProtoMsg) {
        var _this = this;
        var msgAB = txProtoMsg.encodeAB();
        var hash = '#'.charCodeAt(0);
        var msgBB = new ByteBuffer(8 + msgAB.byteLength);
        msgBB
            .writeByte(hash)
            .writeByte(hash)
            .writeUint16(this.getMsgType(txProtoMsg.$type.name))
            .writeUint32(msgAB.byteLength)
            .append(msgAB)
            .reset();
        console.log('adding message to the queue');
        return this.pendingWriteQueue
            .then(function () {
            console.log('sending message');
            return _this._write(msgBB);
        });
    };
    Transport.prototype.read = function () {
        var _this = this;
        return this._read()
            .then(function (rxMsg) {
            var trimmedBuffer = ByteBuffer.wrap(rxMsg.bufferBB.toArrayBuffer().slice(0, rxMsg.header.msgLength));
            return _this.parseMsg(rxMsg.header.msgType, trimmedBuffer);
        });
    };
    Transport.prototype.parseMsgHeader = function (msgBB) {
        for (var i = 0, iMax = this.messageHeaderStart.length; i < iMax; i += 1) {
            var next = String.fromCharCode(msgBB.readByte());
            if (next !== this.messageHeaderStart[i]) {
                throw {
                    name: 'Error',
                    message: 'Message header not found'
                };
            }
        }
        var msgType = msgBB.readUint16();
        var msgLength = msgBB.readUint32();
        msgBB.reset();
        return {
            msgType: msgType,
            msgLength: msgLength
        };
    };
    Transport.prototype.parseMsg = function (msgType, msgBB) {
        var msgClass = this.getMsgClass(msgType);
        return this.protoBuf[msgClass].decode(msgBB);
    };
    Transport.prototype.getMsgType = function (msgClass) {
        if (!this.messageMap.msgClassToType.hasOwnProperty(msgClass)) {
            throw {
                name: 'Error',
                message: 'Cannot find message name.'
            };
        }
        else {
            return this.messageMap.msgClassToType[msgClass];
        }
    };
    Transport.prototype.getMsgClass = function (msgType) {
        if (!this.messageMap.msgTypeToClass.hasOwnProperty(msgType)) {
            throw {
                name: 'Error',
                message: 'Cannot find message id.'
            };
        }
        else {
            return this.messageMap.msgTypeToClass[msgType];
        }
    };
    return Transport;
}());
Transport.MSG_HEADER_LENGTH = 6;
exports.Transport = Transport;
