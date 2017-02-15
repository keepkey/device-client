/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {BasicClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import ChangePin = DeviceMessages.ChangePin;
import {Features} from "../global/features";
import {ActionHelper} from "./action-helper";

export interface ChangePinOptions {
  remove?: boolean;
}

const DEFAULT_OPTIONS: ChangePinOptions = {
  remove: false
};

export class ChangePinAction {
  public static operation(client: BasicClient, options: ChangePinOptions): Promise<any> {
    var o: ChangePinOptions = _.extend(
      {}, DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then((features: Features) => {
        if (!features.initialized) {
          return Promise.reject('Device not initialized');
        }
      })
      .then((features) => {
        var message: ChangePin = DeviceMessageHelper.factory('ChangePin');
        message.setRemove(o.remove);

        return client.writeToDevice(message);
      })
      .catch(ActionHelper.ignoreCancelledAction);
  }
}
