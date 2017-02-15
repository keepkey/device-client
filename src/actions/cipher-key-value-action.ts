/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import ByteBuffer = require('bytebuffer');

import {BasicClient} from "../device-client";
import {NodeVector} from "../node-vector";
import {DeviceMessageHelper} from "../device-message-helper";
import CipherKeyValue = DeviceMessages.CipherKeyValue;
import {Features} from "../global/features";
import {BufferHelper} from "../global/buffer-helper";

export class CipherKeyValueAction {
  public static operation(client: BasicClient,
                          encrypt: boolean,
                          addressN: NodeVector,
                          key: string,
                          value: ByteBuffer,
                          askOnEncrypt: boolean,
                          askOnDecrypt: boolean): Promise<CipherKeyValue> {

    return client.featuresService.promise
      .then<CipherKeyValue>((features: Features) => {
        if (features.initialized) {
          var message: CipherKeyValue = DeviceMessageHelper.factory('CipherKeyValue');
          message.setAddressN(addressN.toArray());
          message.setKey(key);
          message.setValue(BufferHelper.pad(value, 16));
          message.setEncrypt(encrypt);
          message.setAskOnEncrypt(askOnEncrypt);
          message.setAskOnDecrypt(askOnDecrypt);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('encryptKeyValue: device not initialized');
        }
      });
  }
}
