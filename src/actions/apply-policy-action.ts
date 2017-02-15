/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import {DeviceClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import ApplyPolicies = DeviceMessages.ApplyPolicies;
import PolicyType = DeviceMessages.PolicyType;
import {DevicePolicyEnum} from "../global/device-policy-enum";
import {Features} from "../global/features";

export class ApplyPolicyAction {

  public static operation(client: DeviceClient, policyName: DevicePolicyEnum,
                          enabled: boolean): Promise<any> {
    return client.featuresService.promise
      .then((features: Features) => {
        if (features.initialized) {
          var policy: PolicyType = DeviceMessageHelper.factory('PolicyType');
          policy.setPolicyName(DevicePolicyEnum[policyName]);
          policy.setEnabled(enabled);

          var message: ApplyPolicies = DeviceMessageHelper.factory('ApplyPolicies');
          message.setPolicy([policy]);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('ApplyPolicies: device not initialized');
        }
      })
      .then(() => {
        client.featuresService.clear();
        return client.initialize();
      });

  }
}
