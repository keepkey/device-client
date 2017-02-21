import {DeviceMessageHelper} from "./device-message-helper";
import ButtonRequest = DeviceMessages.ButtonRequest;
import ButtonAck = DeviceMessages.ButtonAck;

export class ButtonRequestMessageHandler implements MessageHandler<ButtonRequest, ButtonAck> {
  public static messageNames = ['ButtonRequest'];

  public messageHandler(request: ButtonRequest): ButtonAck {
    return DeviceMessageHelper.factory('ButtonAck');
  }
}
