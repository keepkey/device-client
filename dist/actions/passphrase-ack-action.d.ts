import { BasicClient } from "../device-client";
export declare class PassphraseAckAction {
    static operation(client: BasicClient, passphrase: string): Promise<any>;
}
