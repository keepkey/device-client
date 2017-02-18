import { BasicClient } from "../device-client";
import { Features } from "../global/features";
export interface PinMatrixAckOptions {
    pin?: string;
}
export declare class PinMatrixAckAction {
    private static DEFAULT_OPTIONS;
    static operation(client: BasicClient, options: PinMatrixAckOptions): Promise<Features>;
}
