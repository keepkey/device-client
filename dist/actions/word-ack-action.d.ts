import { BasicClient } from "../device-client";
export interface WordAckOptions {
    word?: string;
}
export declare class WordAckAction {
    private static DEFAULT_OPTIONS;
    static operation(client: BasicClient, options: WordAckOptions): Promise<any>;
}
