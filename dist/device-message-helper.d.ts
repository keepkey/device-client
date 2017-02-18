/// <reference types="bytebuffer" />
import ByteBuffer = require('bytebuffer');
export declare class DeviceMessageHelper {
    static messageFactories: any;
    static factory(MessageType: any, ...args: any[]): any;
    static decode<T>(messageType: string, message: ByteBuffer): T;
    static hydrate(pbMessage: ReflectableProtoBufModel): any;
    static toPrintable(pbMessage: any): string;
    static buffer2Hex(key: any, value: any): any;
    static getSelectedResponse(signedResponse: DeviceMessages.SignedExchangeResponse): DeviceMessages.ExchangeResponse | DeviceMessages.ExchangeResponseV2;
}
