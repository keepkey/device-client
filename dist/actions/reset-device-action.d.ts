import { BasicClient } from "../device-client";
import { Features } from "../global/features";
export interface ResetDeviceOptions {
    display_random?: boolean;
    strength?: number;
    passphrase_protection?: boolean;
    pin_protection?: boolean;
    language?: string;
    label?: string;
}
export declare class ResetDeviceAction {
    private static DEFAULT_OPTIONS;
    static operation(client: BasicClient, options: ResetDeviceOptions): Promise<Features>;
    private static wordCount2KeyStrength(wc);
}
