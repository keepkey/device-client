import { BasicClient } from "../device-client";
export interface RecoverDeviceOptions {
    passphrase_protection?: boolean;
    pin_protection?: boolean;
    language?: string;
    label?: string;
    word_count?: number;
    enforce_wordlist?: boolean;
    use_character_cipher?: boolean;
}
export declare class RecoverDeviceAction {
    private static DEFAULT_OPTIONS;
    static operation(client: BasicClient, options: RecoverDeviceOptions): Promise<any>;
}
