/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import {BasicClient} from "../device-client";
import {NodeVector} from "../node-vector";
import {DeviceMessageHelper} from "../device-message-helper";
import GetPublicKey = DeviceMessages.GetPublicKey;
import {Features} from "../global/features";

export class GetPublicKeyAction {

  public static operation(client: BasicClient, addressN: NodeVector | string,
                          showDisplay: boolean): Promise<any> {
    return client.featuresService.promise
      .then((features: Features) => {
        if (features.initialized) {
          var message: GetPublicKey = DeviceMessageHelper.factory('GetPublicKey');
          message.setAddressN(NodeVector.fromString(addressN).toArray());
          message.setShowDisplay(showDisplay);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('getPublicKey: device not initialized');
        }
      });

  }
}
