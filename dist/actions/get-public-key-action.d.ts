import { BasicClient } from "../device-client";
import { NodeVector } from "../node-vector";
export declare class GetPublicKeyAction {
    static operation(client: BasicClient, addressN: NodeVector | string, showDisplay: boolean): Promise<any>;
}
