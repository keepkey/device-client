import { BasicClient } from "../device-client";
export interface PinMatrixAckOptions {
    pin?: string;
}
export declare class PinMatrixAckAction {
    private static DEFAULT_OPTIONS;
    static operation(client: BasicClient, options: PinMatrixAckOptions): Promise<any>;
}
