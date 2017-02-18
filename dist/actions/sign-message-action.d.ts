/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
import { BasicClient } from "../device-client";
import { NodeVector } from "../node-vector";
export interface SignMessageOptions {
    addressN?: NodeVector | string;
    message?: ByteBuffer;
    coinName?: string;
}
export declare class SignMessageAction {
    static operation(client: BasicClient, options: SignMessageOptions): Promise<any>;
}
