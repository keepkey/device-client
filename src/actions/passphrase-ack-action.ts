/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import {BasicClient} from "../device-client";
import {Logger} from "../../../../Logger";
import PassphraseAck = DeviceMessages.PassphraseAck;
import {DeviceMessageHelper} from "../device-message-helper";

export class PassphraseAckAction {
  public static operation(client: BasicClient, passphrase: string): Promise<any> {
    var message: PassphraseAck = DeviceMessageHelper.factory('PassphraseAck');
    message.setPassphrase(passphrase);

    return client.writeToDevice(message)
      .catch(() => {
        Logger.logger.error('failure while sending passphrase');
      });
  }
}
