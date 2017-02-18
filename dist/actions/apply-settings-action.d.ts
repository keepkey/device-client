import { BasicClient } from "../device-client";
import { Language } from "../global/language";
import { Features } from "../global/features";
export declare class ApplySettingsAction {
    static operation(client: BasicClient, usePassphrase: boolean, language: Language, label: string): Promise<Features>;
}
