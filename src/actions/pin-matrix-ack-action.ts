/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {BasicClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export interface PinMatrixAckOptions {
  pin?: string;
}

export class PinMatrixAckAction {
  private static DEFAULT_OPTIONS: PinMatrixAckOptions = {
    pin: ''
  };

  public static operation(client: BasicClient, options: PinMatrixAckOptions) {
    var o: PinMatrixAckOptions = _.extend(
      {}, PinMatrixAckAction.DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then((features: Features) => {
        var message = DeviceMessageHelper.factory('PinMatrixAck');
        message.setPin(o.pin);

        return client.writeToDevice(message);
      });
  }
}
