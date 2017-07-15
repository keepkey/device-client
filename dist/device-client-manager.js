"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var device_client_1 = require("./device-client");
var device_message_helper_1 = require("./device-message-helper");
var events_1 = require("events");
var RECOGNIZED_DEVICES = [
    {
        type: "KEEPKEY",
        vendorId: 11044,
        productId: 1
    },
    {
        type: "TREZOR",
        vendorId: 21324,
        productId: 1
    }
];
var DeviceClientManager = (function (_super) {
    __extends(DeviceClientManager, _super);
    function DeviceClientManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clients = {};
        return _this;
    }
    Object.defineProperty(DeviceClientManager, "instance", {
        get: function () {
            if (!DeviceClientManager._instance) {
                DeviceClientManager._instance = new DeviceClientManager();
            }
            return DeviceClientManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceClientManager.prototype, "hidHelper", {
        get: function () {
            if (!this._hidHelper) {
                throw 'HidHelper must be set';
            }
            return this._hidHelper;
        },
        set: function (helper) {
            if (this._hidHelper) {
                throw "HidHelper is already set";
            }
            this._hidHelper = helper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceClientManager.prototype, "rawFirmwareStreamFactory", {
        get: function () {
            return this._rawFirmwareStreamFactory;
        },
        set: function (streamFactory) {
            this._rawFirmwareStreamFactory = streamFactory;
        },
        enumerable: true,
        configurable: true
    });
    DeviceClientManager.prototype.findByDeviceId = function (deviceId) {
        return this.clients[deviceId];
    };
    DeviceClientManager.prototype.remove = function (deviceId) {
        if (this.clients[deviceId]) {
            this.clients[deviceId].destroy();
            delete this.clients[deviceId];
        }
    };
    DeviceClientManager.prototype.getActiveClient = function () {
        return this.hidHelper.getActiveClient();
    };
    DeviceClientManager.prototype.factory = function (transport) {
        var deviceType = _.find(RECOGNIZED_DEVICES, {
            vendorId: transport.vendorId,
            productId: transport.productId
        });
        if (deviceType) {
            transport.setMessageMap(deviceType, device_message_helper_1.DeviceMessageHelper.messageFactories);
            return this.findByDeviceId(transport.deviceId) ||
                this.createNewDeviceClient(transport);
        }
        else {
            throw 'unrecognized device: ' + transport;
        }
    };
    DeviceClientManager.prototype.createNewDeviceClient = function (transport) {
        var client = new device_client_1.DeviceClient(transport, this.rawFirmwareStreamFactory);
        this.clients[client.transport.deviceId] = client;
        this.emit(DeviceClientManager.DEVICE_CONNECTED_EVENT, client);
        return client;
    };
    return DeviceClientManager;
}(events_1.EventEmitter));
DeviceClientManager.DEVICE_CONNECTED_EVENT = 'connected';
exports.DeviceClientManager = DeviceClientManager;
