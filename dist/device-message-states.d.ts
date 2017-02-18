import { MessageState } from "./message-states";
import { MessageName } from "./message-states";
export declare class DeviceMessageStates {
    static Cancel: MessageName;
    static TxRequest: MessageName;
    static EthereumTxRequest: MessageName;
    static isInterstitialMessage(lastMessage: MessageState, message: MessageName): boolean;
    static getHostMessageState(name: MessageName): MessageState;
    static getDeviceMessageState(name: MessageName): MessageState;
}
