import ByteBuffer = require('bytebuffer');

import {CipherKeyValueAction} from "./cipher-key-value-action";
import {DeviceClient} from "../device-client";
import {NodeVector} from "../node-vector";
import CipheredKeyValue = DeviceMessages.CipheredKeyValue;

export const NODE_VECTOR_ENCYPTION_KEY = 'node-location';
const ROOT_NODE_VECTOR: NodeVector = new NodeVector([]);

export class CipherNodeVectorAction {
  public static operation(client: DeviceClient,
                          encrypt: boolean,
                          nodeVector: NodeVector | string) {
    var value = encrypt ? NodeVector.fromString(nodeVector).toBuffer()
      : ByteBuffer.fromHex(<string>nodeVector);
    return CipherKeyValueAction.operation(client, encrypt, ROOT_NODE_VECTOR,
      NODE_VECTOR_ENCYPTION_KEY, value, false, false)
      .then((response: CipheredKeyValue) => {
        return encrypt ? response.value.toHex() : NodeVector.fromBuffer(response.value);
      });
  }
}
