"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var word_ack_action_1 = require("./actions/word-ack-action");
var character_ack_action_1 = require("./actions/character-ack-action");
var initialize_action_1 = require("./actions/initialize-action");
var cancel_action_1 = require("./actions/cancel-action");
var wipe_device_action_1 = require("./actions/wipe-device-action");
var reset_device_action_1 = require("./actions/reset-device-action");
var recover_device_action_1 = require("./actions/recover-device-action");
var pin_matrix_ack_action_1 = require("./actions/pin-matrix-ack-action");
var firmware_upload_action_1 = require("./actions/firmware-upload-action");
var get_address_action_1 = require("./actions/get-address-action");
var get_public_key_action_1 = require("./actions/get-public-key-action");
var sign_message_action_1 = require("./actions/sign-message-action");
var encrypt_message_action_1 = require("./actions/encrypt-message-action");
var end_session_action_1 = require("./actions/end-session-action");
var change_pin_action_1 = require("./actions/change-pin-action");
var apply_settings_action_1 = require("./actions/apply-settings-action");
var device_message_helper_1 = require("./device-message-helper");
var stateful_device_messenger_1 = require("./stateful-device-messenger");
var entropy_request_message_handler_1 = require("./entropy-request-message-handler");
var button_request_message_handler_1 = require("./button-request-message-handler");
var cipher_node_vector_action_1 = require("./actions/cipher-node-vector-action");
var cipher_account_name_action_1 = require("./actions/cipher-account-name-action");
var passphrase_ack_action_1 = require("./actions/passphrase-ack-action");
var apply_policy_action_1 = require("./actions/apply-policy-action");
var get_ethereum_address_action_1 = require("./actions/get-ethereum-address-action");
var features_service_1 = require("./features-service");
var events_1 = require("events");
exports.KEEPKEY = 'KEEPKEY';
var DeviceClient = (function (_super) {
    __extends(DeviceClient, _super);
    function DeviceClient(transport, rawFirmwareStreamFactory) {
        var _this = _super.call(this) || this;
        _this.transport = transport;
        _this.rawFirmwareStreamFactory = rawFirmwareStreamFactory;
        _this.initialize = _.partial(initialize_action_1.InitializeAction.operation, _this);
        _this.cancel = _.partial(cancel_action_1.CancelAction.operation, _this);
        _this.wipeDevice = _.partial(wipe_device_action_1.WipeDeviceAction.operation, _this);
        _this.resetDevice = _.partial(reset_device_action_1.ResetDeviceAction.operation, _this, _);
        _this.recoveryDevice = _.partial(recover_device_action_1.RecoverDeviceAction.operation, _this, _);
        _this.pinMatrixAck = _.partial(pin_matrix_ack_action_1.PinMatrixAckAction.operation, _this, _);
        _this.wordAck = _.partial(word_ack_action_1.WordAckAction.operation, _this, _);
        _this.characterAck = _.partial(character_ack_action_1.CharacterAckAction.operation, _this, _);
        _this.firmwareUpload = _.partial(firmware_upload_action_1.FirmwareUploadAction.operation, _this);
        _this.getAddress = _.partial(get_address_action_1.GetAddressAction.operation, _this, _, _, true, null);
        _this.getEthereumAddress = _.partial(get_ethereum_address_action_1.GetEthereumAddressAction.operation, _this, _, _);
        _this.getPublicKey = (_.partial(get_public_key_action_1.GetPublicKeyAction.operation, _this, _, _));
        _this.signMessage = _.partial(sign_message_action_1.SignMessageAction.operation, _this, _);
        _this.encryptMessage = _.partial(encrypt_message_action_1.EncryptMessageAction.operation, _this, _);
        _this.endSession = _.partial(end_session_action_1.EndSessionAction.operation, _this);
        _this.changePin = _.partial(change_pin_action_1.ChangePinAction.operation, _this, _);
        _this.changeLabel = _.partial(apply_settings_action_1.ApplySettingsAction.operation, _this, null, null, _);
        _this.enablePassphrase = _.partial(apply_settings_action_1.ApplySettingsAction.operation, _this, _, null, null);
        _this.encryptNodeVector = _.partial(cipher_node_vector_action_1.CipherNodeVectorAction.operation, _this, true, _);
        _this.decryptNodeVector = (_.partial(cipher_node_vector_action_1.CipherNodeVectorAction.operation, _this, false, _));
        _this.encryptAccountName = _.partial(cipher_account_name_action_1.CipherAccountNameAction.operation, _this, true, _, _);
        _this.decryptAccountName = (_.partial(cipher_account_name_action_1.CipherAccountNameAction.operation, _this, false, _, _));
        _this.sendPassphrase = (_.partial(passphrase_ack_action_1.PassphraseAckAction.operation, _this, _));
        _this.enablePolicy = (_.partial(apply_policy_action_1.ApplyPolicyAction.operation, _this, _, _));
        _this.devicePollingInterval = setInterval(function () {
            _this.pollDevice();
        }, 0);
        _this.addMessageHandler(button_request_message_handler_1.ButtonRequestMessageHandler);
        _this.addMessageHandler(entropy_request_message_handler_1.EntropyRequestMessageHandler);
        return _this;
    }
    Object.defineProperty(DeviceClient.prototype, "deviceMessenger", {
        get: function () {
            var _this = this;
            if (!this._deviceMessenger) {
                this._deviceMessenger = new stateful_device_messenger_1.StatefulDeviceMessenger(this.transport);
                this._deviceMessenger.on(stateful_device_messenger_1.StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, function (message) {
                    _this.emit(DeviceClient.UNEXPECTED_MESSAGE_EVENT, message);
                });
            }
            return this._deviceMessenger;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceClient.prototype, "featuresService", {
        get: function () {
            if (!this._featuresService) {
                this._featuresService = new features_service_1.FeaturesService();
            }
            return this._featuresService;
        },
        enumerable: true,
        configurable: true
    });
    DeviceClient.prototype.destroy = function () {
        this.stopPolling();
        this.removeAllListeners();
        console.log("%s Disconnected: %d", this.deviceType, this.transport.deviceId);
    };
    DeviceClient.prototype.writeToDevice = function (message) {
        return this.deviceMessenger.send(message);
    };
    DeviceClient.prototype.addMessageHandler = function (handler) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlerInstance = new (Function.prototype.bind.apply(handler, arguments));
        _.each(handler.messageNames, function (messageName) {
            console.log(messageName + " message handler added.");
            _this.addListener(messageName, _this.messageHandlerWrapper(handlerInstance));
        });
    };
    DeviceClient.prototype.removeMessageHandler = function (handler) {
        var _this = this;
        _.each(handler.messageNames, function (messageName) {
            console.log(messageName + " message handler removed.");
            _this.removeAllListeners(messageName);
        });
    };
    DeviceClient.prototype.stopPolling = function () {
        clearInterval(this.devicePollingInterval);
    };
    Object.defineProperty(DeviceClient.prototype, "deviceType", {
        get: function () {
            return this.transport.vendorId;
        },
        enumerable: true,
        configurable: true
    });
    DeviceClient.prototype.messageHandlerWrapper = function (handlerInstance) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var reply = handlerInstance.messageHandler.apply(handlerInstance, args);
            if (reply) {
                _this.writeToDevice(reply);
            }
        };
    };
    DeviceClient.prototype.pollDevice = function () {
        var _this = this;
        if (!this.transport.deviceInUse) {
            this.transport.deviceInUse = true;
            this.transport.read()
                .then(function (message) {
                _this.transport.deviceInUse = false;
                var hydratedMessage = device_message_helper_1.DeviceMessageHelper.hydrate(message);
                console.log('device --> proxy: [%s]\n', message.$type.name, JSON.stringify(hydratedMessage, device_message_helper_1.DeviceMessageHelper.buffer2Hex, 4));
                if (message) {
                    if (_this.deviceMessenger.receive.call(_this.deviceMessenger, message)) {
                        _this.emit(hydratedMessage.typeName, hydratedMessage);
                        if (hydratedMessage.request_type) {
                            _this.emit(hydratedMessage.typeName + "_" + hydratedMessage.request_type, hydratedMessage);
                        }
                    }
                }
            })
                .catch(function (err) {
                console.error('caught in client:', err);
                setTimeout(function () {
                    _this.transport.deviceInUse = false;
                });
            });
        }
    };
    DeviceClient.UNEXPECTED_MESSAGE_EVENT = stateful_device_messenger_1.StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT;
    return DeviceClient;
}(events_1.EventEmitter));
exports.DeviceClient = DeviceClient;
