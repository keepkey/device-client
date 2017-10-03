import { BasicClient } from "../device-client";
import { Language } from "../global/language";
export declare class ApplySettingsAction {
    static operation(client: BasicClient, usePassphrase: boolean, language: Language, label: string): Promise<any>;
}
