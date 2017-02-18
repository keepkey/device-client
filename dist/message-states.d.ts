export declare type MessageName = string;
export declare enum DeviceExecutionMode {
    running = 0,
    bootLoader = 1,
    debug = 2,
}
export declare enum MessageDirection {
    request = 0,
    response = 1,
}
export declare enum MessageSender {
    host = 0,
    device = 1,
}
export interface MessageState {
    messageName: MessageName;
    validMode: DeviceExecutionMode;
    sender: MessageSender;
    messageType: MessageDirection;
    userInteractionRequired: boolean;
    resolveMessage?: MessageName;
    rejectMessage?: MessageName;
    interstitialMessages?: Array<MessageName>;
}
export declare class MessageStates {
    private static states;
    static getMessageState(sender: MessageSender, direction: MessageDirection, name: MessageName): MessageState;
    static register(state: MessageState): void;
}
