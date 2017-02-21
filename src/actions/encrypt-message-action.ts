import * as _ from 'lodash';
import ByteBuffer = require('bytebuffer');

import {BasicClient} from "../device-client";
import {NodeVector} from "../node-vector";
import {DeviceMessageHelper} from "../device-message-helper";
import EncryptMessage = DeviceMessages.EncryptMessage;
import {Features} from "../global/features";
import {BufferHelper} from "../global/buffer-helper";

export interface EncryptMessageOptions {
  addressN?: NodeVector | string;
  message?: ByteBuffer;
  publicKey?: ByteBuffer;
  displayOnly?: boolean;
  coinName?: string;
}

const DEFAULT_OPTIONS: EncryptMessageOptions = {
  addressN: new NodeVector([]),
  message: ByteBuffer.wrap(''),
  publicKey: ByteBuffer.wrap(''),
  displayOnly: false,
  coinName: 'Bitcoin'
};


//FIXME I can't get this to work. The device always returns an error that the key is incorrect.
export class EncryptMessageAction {
  public static operation(client: BasicClient, options: EncryptMessageOptions): Promise<any> {
    var o: EncryptMessageOptions = _.extend(
      {}, DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then(function (features: Features) {
        if (features.initialized) {
          var message: EncryptMessage = DeviceMessageHelper.factory('EncryptMessage');
          message.setPubkey(BufferHelper.pad(o.publicKey, 33));
          message.setMessage(o.message);
          message.setDisplayOnly(o.displayOnly);
          message.setAddressN(NodeVector.fromString(options.addressN).toArray());
          message.setCoinName(o.coinName);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('encryptMessage: device not initialized');
        }
      });

  }

}
