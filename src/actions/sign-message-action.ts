/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';
import ByteBuffer = require('bytebuffer');

import {BasicClient} from "../device-client";
import {NodeVector} from "../node-vector";
import SignMessage = DeviceMessages.SignMessage;
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export interface SignMessageOptions {
  addressN?: NodeVector | string;
  message?: ByteBuffer;
  coinName?: string;
}

const DEFAULT_OPTIONS: SignMessageOptions = {
  addressN: new NodeVector([]),
  message: ByteBuffer.wrap(''),
  coinName: 'Bitcoin'
};

export class SignMessageAction {
  public static operation(client: BasicClient, options: SignMessageOptions): Promise<any> {
    var o: SignMessageOptions = _.extend(
      {}, DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then(function (features: Features) {
        if (features.initialized) {
          var message: SignMessage = DeviceMessageHelper.factory('SignMessage');
          message.setAddressN(NodeVector.fromString(o.addressN).toArray());
          message.setMessage(o.message);
          message.setCoinName(o.coinName);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('signMessage: device not initialized');
        }
      });

  }
}
