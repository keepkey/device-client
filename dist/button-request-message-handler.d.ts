import ButtonRequest = DeviceMessages.ButtonRequest;
import ButtonAck = DeviceMessages.ButtonAck;
export declare class ButtonRequestMessageHandler implements MessageHandler<ButtonRequest, ButtonAck> {
    static messageNames: string[];
    messageHandler(request: ButtonRequest): ButtonAck;
}
