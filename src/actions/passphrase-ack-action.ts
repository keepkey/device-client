import {BasicClient} from "../device-client";
import PassphraseAck = DeviceMessages.PassphraseAck;
import {DeviceMessageHelper} from "../device-message-helper";

export class PassphraseAckAction {
  public static operation(client: BasicClient, passphrase: string): Promise<any> {
    var message: PassphraseAck = DeviceMessageHelper.factory('PassphraseAck');
    message.setPassphrase(passphrase);

    return client.writeToDevice(message)
      .catch(() => {
        console.log('failure while sending passphrase');
      });
  }
}
