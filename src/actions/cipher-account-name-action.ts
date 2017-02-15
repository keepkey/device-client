import ByteBuffer = require('bytebuffer');

import {CipherKeyValueAction} from "./cipher-key-value-action";
import {DeviceClient} from "../device-client";
import CipheredKeyValue = DeviceMessages.CipheredKeyValue;
import {NodeVector} from "../node-vector";

const ACCOUNT_NAME_ENCYPTION_KEY = 'node-location';

export class CipherAccountNameAction {
  public static operation(client: DeviceClient,
                          encrypt: boolean,
                          nodePath: NodeVector,
                          value: string): Promise<string> {

    var valueBuffer = encrypt ? ByteBuffer.wrap(value) : ByteBuffer.fromHex(value);

    return CipherKeyValueAction.operation(client, encrypt,
      NodeVector.fromString(nodePath), ACCOUNT_NAME_ENCYPTION_KEY,
      valueBuffer, false, false)
      .then<string>((response: CipheredKeyValue) => {
        return encrypt ? response.value.toHex() : response.value.toUTF8().replace(/\0/g, '');
      });
  }
}
