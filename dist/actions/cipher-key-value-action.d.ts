/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
import { BasicClient } from "../device-client";
import { NodeVector } from "../node-vector";
import CipherKeyValue = DeviceMessages.CipherKeyValue;
export declare class CipherKeyValueAction {
    static operation(client: BasicClient, encrypt: boolean, addressN: NodeVector, key: string, value: ByteBuffer, askOnEncrypt: boolean, askOnDecrypt: boolean): Promise<CipherKeyValue>;
}
