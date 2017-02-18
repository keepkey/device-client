"use strict";
var _ = require("lodash");
var device_message_helper_1 = require("../device-message-helper");
var action_helper_1 = require("./action-helper");
var DEFAULT_OPTIONS = {
    remove: false
};
var ChangePinAction = (function () {
    function ChangePinAction() {
    }
    ChangePinAction.operation = function (client, options) {
        var o = _.extend({}, DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            if (!features.initialized) {
                return Promise.reject('Device not initialized');
            }
        })
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('ChangePin');
            message.setRemove(o.remove);
            return client.writeToDevice(message);
        })
            .catch(action_helper_1.ActionHelper.ignoreCancelledAction);
    };
    return ChangePinAction;
}());
exports.ChangePinAction = ChangePinAction;
