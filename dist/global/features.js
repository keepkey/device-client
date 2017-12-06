"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var device_policy_enum_1 = require("./device-policy-enum");
var coin_name_1 = require("./coin-name");
var Features = (function () {
    function Features(data) {
        this.data = data;
    }
    Object.defineProperty(Features.prototype, "version", {
        get: function () {
            return [
                this.data.major_version.toString(),
                this.data.minor_version.toString(),
                this.data.patch_version.toString()
            ].join('.');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "initialized", {
        get: function () {
            return this.data.initialized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "bootloaderMode", {
        get: function () {
            return this.data.bootloader_mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "supportsCipheredKeyRecovery", {
        get: function () {
            return _.get(this.data, 'deviceCapabilities.supportsCipheredKeyRecovery');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "defaultMnemonicSeedLength", {
        get: function () {
            return _.get(this.data, 'deviceCapabilities.defaultMnemonicSeedLength');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "usesShapeshiftResponseV2", {
        get: function () {
            return _.get(this.data, 'deviceCapabilities.usesShapeshiftResponseV2');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "raw", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Features.prototype.supportsPolicy = function (policy) {
        return !!(this.findPolicy(policy));
    };
    Features.prototype.policyEnabled = function (policy) {
        return _.get(this.findPolicy(policy), 'enabled');
    };
    Features.prototype.supportsCoinType = function (coin) {
        var coinName = coin_name_1.CoinName[coin];
        return !!(_.find(this.data.coin_metadata, { name: coinName }));
    };
    Object.defineProperty(Features.prototype, "model", {
        get: function () {
            return this.data.model;
        },
        enumerable: true,
        configurable: true
    });
    Features.prototype.findPolicy = function (policy) {
        return _.find(this.data.policies, {
            policy_name: device_policy_enum_1.DevicePolicyEnum[policy]
        });
    };
    return Features;
}());
exports.Features = Features;
