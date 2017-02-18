import { BasicClient } from "../device-client";
export interface ChangePinOptions {
    remove?: boolean;
}
export declare class ChangePinAction {
    static operation(client: BasicClient, options: ChangePinOptions): Promise<any>;
}
