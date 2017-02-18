/// <reference types="node" />
import EventEmitter = NodeJS.EventEmitter;
export declare class StatefulDeviceMessenger extends EventEmitter {
    private transport;
    static UNEXPECTED_MESSAGE_EVENT: string;
    private writeRequestInProgress;
    private pendingMessageQueue;
    private isDisabled;
    constructor(transport: any);
    send(message: ReflectableProtoBufModel): Promise<any>;
    receive(message: any): boolean;
    private cancelPendingRequests();
    private enqueueMessage(message);
    private dequeueMessage();
}
