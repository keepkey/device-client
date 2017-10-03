/// <reference path="../src/global/message-handler.d.ts" />
/// <reference types="node" />
/// <reference types="lodash" />
import * as _ from 'lodash';
import { StatefulDeviceMessenger } from "./stateful-device-messenger";
import { Transport } from "./transport";
import * as DeviceClientMethods from "./device-client-methods";
import { FeaturesService } from "./features-service";
import { EventEmitter } from "events";
import { Readable } from "stream";
export declare const KEEPKEY = "KEEPKEY";
export interface BasicClient {
    featuresService: FeaturesService;
    writeToDevice: (message) => Promise<any>;
}
export declare class DeviceClient extends EventEmitter implements BasicClient {
    transport: Transport;
    rawFirmwareStreamFactory: () => Readable;
    static UNEXPECTED_MESSAGE_EVENT: string;
    initialize: _.Function0<Promise<any>>;
    cancel: _.Function0<Promise<any>>;
    wipeDevice: _.Function0<Promise<any>>;
    resetDevice: DeviceClientMethods.ResetDeviceFunction;
    recoveryDevice: DeviceClientMethods.RecoveryDeviceFunction;
    pinMatrixAck: Function;
    wordAck: Function;
    characterAck: Function;
    firmwareUpload: DeviceClientMethods.FirmwareUploadFunction;
    getAddress: DeviceClientMethods.GetAddressFunction;
    getEthereumAddress: DeviceClientMethods.GetEthereumAddressFunction;
    getPublicKey: DeviceClientMethods.GetPublicKeyFunction;
    signMessage: Function;
    encryptMessage: Function;
    endSession: _.Function0<Promise<any>>;
    changePin: Function;
    changeLabel: DeviceClientMethods.ChangeLabelFunction;
    enablePassphrase: DeviceClientMethods.EnablePassphraseFunction;
    encryptNodeVector: DeviceClientMethods.EncryptNodeVectorFunction;
    decryptNodeVector: DeviceClientMethods.DecryptNodeVectorFunction;
    encryptAccountName: DeviceClientMethods.CipherAccountNameFunction;
    decryptAccountName: DeviceClientMethods.CipherAccountNameFunction;
    sendPassphrase: DeviceClientMethods.SendPassphraseFunction;
    enablePolicy: DeviceClientMethods.ApplyPolicyFunction;
    private _deviceMessenger;
    readonly deviceMessenger: StatefulDeviceMessenger;
    private _featuresService;
    readonly featuresService: FeaturesService;
    private devicePollingInterval;
    constructor(transport: Transport, rawFirmwareStreamFactory?: () => Readable);
    destroy(): void;
    writeToDevice(message: any): Promise<any>;
    addMessageHandler(handler: MessageHandlerClass<ProtoBufModel, ProtoBufModel | void>, ...args: any[]): void;
    removeMessageHandler(handler: MessageHandlerClass<ProtoBufModel, ProtoBufModel | void>): void;
    stopPolling(): void;
    readonly deviceType: any;
    private messageHandlerWrapper(handlerInstance);
    private pollDevice();
}
