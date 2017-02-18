"use strict";
var _ = require("lodash");
var device_message_helper_1 = require("../device-message-helper");
var WordAckAction = (function () {
    function WordAckAction() {
    }
    WordAckAction.operation = function (client, options) {
        var o = _.extend({}, WordAckAction.DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('WordAck');
            message.setWord(o.word);
            return client.writeToDevice(message);
        });
    };
    return WordAckAction;
}());
WordAckAction.DEFAULT_OPTIONS = {
    word: ''
};
exports.WordAckAction = WordAckAction;
