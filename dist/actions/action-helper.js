"use strict";
var _ = require("lodash");
var ActionHelper = (function () {
    function ActionHelper() {
    }
    ActionHelper.ignoreCancelledAction = function (message) {
        if (!ActionHelper.isCancelledMessage(message)) {
            return Promise.reject(message);
        }
    };
    ActionHelper.isCancelledMessage = function (message) {
        return (_.isString(message) && message.endsWith('cancelled')) ||
            (_.isString(message.code) && message.code.endsWith('Cancelled'));
    };
    return ActionHelper;
}());
exports.ActionHelper = ActionHelper;
