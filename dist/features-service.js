"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.addFeatureDataToCoinType(features.coins);
        features.coin_metadata = coin_type_1.CoinType.getList().map(function (coin) { return coin.toFeatureCoinMetadata(); });
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
    FeaturesService.prototype.addFeatureDataToCoinType = function (coins) {
        coins.forEach(function (coin) {
            coin_type_1.CoinType.fromFeatureCoin(coin);
        });
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
        coin_type_1.CoinType.clearList();
    };
    FeaturesService.firmwareFileMetaData = require('../dist/keepkey_main.json');
    FeaturesService.deviceProfiles = require('../dist/device-profiles.json');
    return FeaturesService;
}());
exports.FeaturesService = FeaturesService;
