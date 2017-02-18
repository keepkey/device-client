import EntropyRequest = DeviceMessages.EntropyRequest;
import EntropyAck = DeviceMessages.EntropyAck;
export declare class EntropyRequestMessageHandler implements MessageHandler<EntropyRequest, EntropyAck> {
    static messageNames: string[];
    messageHandler(request: EntropyRequest): EntropyAck;
}
