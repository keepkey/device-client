import { DeviceClient } from "../device-client";
import { NodeVector } from "../node-vector";
export declare class CipherAccountNameAction {
    static operation(client: DeviceClient, encrypt: boolean, nodePath: NodeVector, value: string): Promise<string>;
}
