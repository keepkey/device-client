export interface CharacterAckOptions {
    character?: string;
    delete?: boolean;
    done?: boolean;
}
export declare class CharacterAckAction {
    private static DEFAULT_OPTIONS;
    static operation(client: any, options: CharacterAckOptions): any;
}
