"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_message_helper_1 = require("../device-message-helper");
var device_policy_enum_1 = require("../global/device-policy-enum");
var ApplyPolicyAction = (function () {
    function ApplyPolicyAction() {
    }
    ApplyPolicyAction.operation = function (client, policyName, enabled) {
        return client.featuresService.promise
            .then(function (features) {
            if (features.initialized) {
                var policy = device_message_helper_1.DeviceMessageHelper.factory('PolicyType');
                policy.setPolicyName(device_policy_enum_1.DevicePolicyEnum[policyName]);
                policy.setEnabled(enabled);
                var message = device_message_helper_1.DeviceMessageHelper.factory('ApplyPolicies');
                message.setPolicy([policy]);
                return client.writeToDevice(message);
            }
            else {
                return Promise.reject('ApplyPolicies: device not initialized');
            }
        })
            .then(function () {
            client.featuresService.clear();
            return client.initialize();
        });
    };
    return ApplyPolicyAction;
}());
exports.ApplyPolicyAction = ApplyPolicyAction;
