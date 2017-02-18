"use strict";
var device_message_helper_1 = require("../device-message-helper");
var language_1 = require("../global/language");
var action_helper_1 = require("./action-helper");
var ApplySettingsAction = (function () {
    function ApplySettingsAction() {
    }
    ApplySettingsAction.operation = function (client, usePassphrase, language, label) {
        return client.featuresService.promise
            .then(function (features) {
            if (!features.initialized) {
                return Promise.reject('Device not initialized');
            }
        })
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('ApplySettings');
            if (label !== null) {
                message.setLabel(label);
            }
            if (language !== null) {
                message.setLanguage(language_1.Language[language]);
            }
            if (usePassphrase !== null) {
                message.setUsePassphrase(usePassphrase);
            }
            return client.writeToDevice(message);
        })
            .catch(action_helper_1.ActionHelper.ignoreCancelledAction);
    };
    return ApplySettingsAction;
}());
exports.ApplySettingsAction = ApplySettingsAction;
