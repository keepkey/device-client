"use strict";
var _ = require("lodash");
var features_1 = require("./global/features");
var coin_type_1 = require("./global/coin-type");
var FeaturesService = (function () {
    function FeaturesService() {
    }
    FeaturesService.getDeviceCapabilities = function (features) {
        var deviceProfile = _.find(FeaturesService.deviceProfiles, function (profile) {
            return !!(_.find([features], profile.identity));
        });
        if (!deviceProfile) {
            console.error('Unknown device or version');
            return undefined;
        }
        else {
            return deviceProfile.capabilities;
        }
    };
    FeaturesService.prototype.setValue = function (features) {
        features.available_firmware_version = FeaturesService.firmwareFileMetaData.version;
        features.deviceCapabilities = FeaturesService.getDeviceCapabilities(features);
        features.coins.push({
            coin_name: "BitcoinCash",
            coin_shortcut: "BCH",
            address_type: 0,
            maxfee_kb: "100000",
            address_type_p2sh: 5,
            address_type_p2wpkh: 6,
            address_type_p2wsh: 10,
            signed_message_header: "\u0018Bitcoin Signed Message:\n",
            bip44_account_path: 2147483648
        });
        features.coin_metadata = _.intersectionWith(coin_type_1.CoinType.getList(), features.coins, function (metadata, deviceCoin) {
            return metadata.name === deviceCoin.coin_name;
        });
        features.coin_metadata.push(coin_type_1.CoinType.getBySymbol("BCH").configuration);
        if (!this._promise || !this.resolver) {
            if (features.deviceCapabilities) {
                this._promise = Promise.resolve(new features_1.Features(features));
            }
            else {
                this._promise = Promise.reject('Unknown device or version');
            }
        }
        else {
            if (features.deviceCapabilities) {
                this.resolver(new features_1.Features(features));
            }
            else {
                this.rejector('Unknown device or version');
            }
            this.resolver = undefined;
            this.rejector = undefined;
        }
    };
    Object.defineProperty(FeaturesService.prototype, "promise", {
        get: function () {
            var _this = this;
            if (!this._promise) {
                this._promise = new Promise(function (resolve, reject) {
                    _this.resolver = resolve;
                    _this.rejector = reject;
                });
            }
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    FeaturesService.prototype.clear = function () {
        this._promise = undefined;
        this.resolver = undefined;
    };
    return FeaturesService;
}());
FeaturesService.firmwareFileMetaData = require('../dist/keepkey_main.json');
FeaturesService.deviceProfiles = require('../dist/device-profiles.json');
exports.FeaturesService = FeaturesService;
