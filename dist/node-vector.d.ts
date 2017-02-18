/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
export declare class NodeVector {
    private _value;
    constructor(args: Array<number>);
    static fromString(addressN: NodeVector | string): NodeVector;
    static fromBuffer(buffer: ByteBuffer): NodeVector;
    static join(vectors: Array<NodeVector | string>): NodeVector;
    private static convertNodeStringToNumber(result, nodeString);
    join(o: NodeVector | string): NodeVector;
    toString(): string;
    toArray(): Array<number>;
    toBuffer(): ByteBuffer;
}
