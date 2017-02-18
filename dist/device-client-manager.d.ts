/// <reference types="node" />
import { DeviceClient } from "./device-client";
import { Transport } from "./transport";
import { EventEmitter } from "events";
import { HidHelper } from "./hid-helper";
import { Readable } from "stream";
export declare class DeviceClientManager extends EventEmitter {
    static DEVICE_CONNECTED_EVENT: string;
    private static _instance;
    static readonly instance: DeviceClientManager;
    private _hidHelper;
    hidHelper: HidHelper;
    private _rawFirmwareStreamFactory;
    rawFirmwareStreamFactory: () => Readable;
    private clients;
    findByDeviceId(deviceId: any): DeviceClient;
    remove(deviceId: any): void;
    getActiveClient(): Promise<DeviceClient>;
    factory(transport: Transport): DeviceClient;
    private createNewDeviceClient(transport);
}
