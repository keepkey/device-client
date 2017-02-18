/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
import { BasicClient } from "../device-client";
import { NodeVector } from "../node-vector";
export interface EncryptMessageOptions {
    addressN?: NodeVector | string;
    message?: ByteBuffer;
    publicKey?: ByteBuffer;
    displayOnly?: boolean;
    coinName?: string;
}
export declare class EncryptMessageAction {
    static operation(client: BasicClient, options: EncryptMessageOptions): Promise<any>;
}
