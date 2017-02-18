import { DeviceClient } from "../device-client";
import { NodeVector } from "../node-vector";
export declare const NODE_VECTOR_ENCYPTION_KEY = "node-location";
export declare class CipherNodeVectorAction {
    static operation(client: DeviceClient, encrypt: boolean, nodeVector: NodeVector | string): Promise<string | NodeVector>;
}
