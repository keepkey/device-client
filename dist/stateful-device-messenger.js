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
var device_message_helper_1 = require("./device-message-helper");
var device_message_states_1 = require("./device-message-states");
var EventEmitter = require("events");
var StatefulDeviceMessenger = (function (_super) {
    __extends(StatefulDeviceMessenger, _super);
    function StatefulDeviceMessenger(transport) {
        var _this = _super.call(this) || this;
        _this.transport = transport;
        _this.writeRequestInProgress = [];
        _this.pendingMessageQueue = [];
        _this.isDisabled = false;
        return _this;
    }
    StatefulDeviceMessenger.prototype.send = function (message) {
        var _this = this;
        if (this.isDisabled) {
            return Promise.reject("failed state");
        }
        var messageType = message.$type.name;
        var state = device_message_states_1.DeviceMessageStates.getHostMessageState(messageType);
        if (this.writeRequestInProgress.length) {
            var lastRequest = _.last(this.writeRequestInProgress);
            if (lastRequest.resolveMessage === messageType) {
                this.writeRequestInProgress.pop();
            }
            else if (messageType === device_message_states_1.DeviceMessageStates.Cancel) {
                _.each(this.writeRequestInProgress, function (request) {
                    request.reject && request.reject(request.messageName + " cancelled");
                });
                this.writeRequestInProgress.length = 0;
                this.cancelPendingRequests();
            }
            else if (!device_message_states_1.DeviceMessageStates.isInterstitialMessage(lastRequest, messageType)) {
                return this.enqueueMessage(message);
            }
        }
        return new Promise(function (resolve, reject) {
            if (state && state.resolveMessage) {
                var requestInProgress = (_.extend({
                    resolve: resolve,
                    reject: reject
                }, state));
                _this.writeRequestInProgress.push(requestInProgress);
            }
            else {
                resolve();
            }
            console.log('proxy --> device:\n    [%s] %s\n    WaitFor: %s', message.$type.name, device_message_helper_1.DeviceMessageHelper.toPrintable(message), state && state.resolveMessage);
            _this.transport.write.call(_this.transport, message)
                .then(function () {
                if (_this.writeRequestInProgress.length === 0) {
                    _this.dequeueMessage();
                }
            })
                .catch(function () {
                console.log('Failed when writing to device');
                _this.writeRequestInProgress.length = 0;
                _this.cancelPendingRequests();
                reject.apply(message);
            });
        });
    };
    StatefulDeviceMessenger.prototype.receive = function (message) {
        var messageType = message.$type.name;
        var hydratedMessage = device_message_helper_1.DeviceMessageHelper.hydrate(message);
        if (!this.isDisabled) {
            if (this.writeRequestInProgress.length) {
                var writeRequest = _.last(this.writeRequestInProgress);
                if (messageType === device_message_states_1.DeviceMessageStates.TxRequest) {
                    messageType += '_' + hydratedMessage.request_type;
                }
                if (writeRequest.resolveMessage === messageType) {
                    this.writeRequestInProgress.pop();
                    writeRequest.resolve(hydratedMessage);
                    this.dequeueMessage();
                }
                else if (device_message_states_1.DeviceMessageStates.isInterstitialMessage(writeRequest, messageType)) {
                    this.writeRequestInProgress.push(device_message_states_1.DeviceMessageStates.getDeviceMessageState(message.$type.name));
                    return true;
                }
                else if (writeRequest.rejectMessage === messageType) {
                    this.writeRequestInProgress.pop();
                    writeRequest.reject(hydratedMessage);
                }
                else {
                    this.cancelPendingRequests();
                    this.isDisabled = true;
                    this.emit(StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, {
                        message: messageType
                    });
                }
            }
            else if (messageType === 'Failure') {
            }
            else {
                console.error('no incoming messages expected. got:', messageType);
                this.isDisabled = true;
                this.emit(StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, {
                    message: messageType
                });
            }
        }
        return !this.isDisabled;
    };
    StatefulDeviceMessenger.prototype.cancelPendingRequests = function () {
        _.each(this.pendingMessageQueue, function (pendingMessage) {
            pendingMessage.reject(pendingMessage.message.$type.name + " not sent due to Cancel request");
        });
        this.pendingMessageQueue.length = 0;
    };
    ;
    StatefulDeviceMessenger.prototype.enqueueMessage = function (message) {
        var resolver, rejector;
        var promise = new Promise(function (resolve, reject) {
            resolver = resolve;
            rejector = reject;
        });
        this.pendingMessageQueue.push({
            message: message,
            resolve: resolver,
            reject: rejector
        });
        return promise;
    };
    StatefulDeviceMessenger.prototype.dequeueMessage = function () {
        if (this.pendingMessageQueue.length) {
            var pendingMessage = this.pendingMessageQueue.shift();
            this.send(pendingMessage.message)
                .then(pendingMessage.resolve)
                .catch(pendingMessage.reject);
        }
    };
    StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT = 'unexpected-message';
    return StatefulDeviceMessenger;
}(EventEmitter));
exports.StatefulDeviceMessenger = StatefulDeviceMessenger;
