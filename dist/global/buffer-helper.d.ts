/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
export declare class BufferHelper {
    static pad(buffer: ByteBuffer, padSize: number): ByteBuffer;
}
