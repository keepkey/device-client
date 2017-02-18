"use strict";
var _ = require("lodash");
var device_message_helper_1 = require("../device-message-helper");
var CharacterAckAction = (function () {
    function CharacterAckAction() {
    }
    CharacterAckAction.operation = function (client, options) {
        var o = _.extend({}, CharacterAckAction.DEFAULT_OPTIONS, options);
        return client.featuresService.promise
            .then(function (features) {
            var message = device_message_helper_1.DeviceMessageHelper.factory('CharacterAck');
            message.setCharacter(o.character);
            message.setDelete(o.delete);
            message.setDone(o.done);
            return client.writeToDevice(message);
        });
    };
    return CharacterAckAction;
}());
CharacterAckAction.DEFAULT_OPTIONS = {
    character: '',
    delete: false,
    done: false
};
exports.CharacterAckAction = CharacterAckAction;
