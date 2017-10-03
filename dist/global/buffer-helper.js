"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ByteBuffer = require("bytebuffer");
var BufferHelper = (function () {
    function BufferHelper() {
    }
    BufferHelper.pad = function (buffer, padSize) {
        var bufferLength = buffer.limit - buffer.offset;
        if (bufferLength % padSize) {
            var newBufferLength = Math.ceil(bufferLength / padSize) * padSize;
            var padded = ByteBuffer.allocate(newBufferLength).fill(0).reset();
            buffer.copyTo(padded);
            return padded.reset();
        }
        else {
            return buffer;
        }
    };
    return BufferHelper;
}());
exports.BufferHelper = BufferHelper;
