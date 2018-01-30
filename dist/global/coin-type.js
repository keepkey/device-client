"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ByteBuffer = require("bytebuffer");
var bignumber_js_1 = require("bignumber.js");
var Long = require("long");
var coin_name_1 = require("./coin-name");
var ASSUMED_TX_SIZE = 182;
var BITCOIN_DUST_RELAY_FEE = 3000;
var LITECOIN_DUST_RELAY_FEE = 100000;
var DASH_MIN_RELAY_TX_FEE = 10000;
var ETHEREUM_ADDRESS_FORMAT = "^(0x)?[0-9a-fA-F]{40}$";
var CoinType = (function () {
    function CoinType(configuration) {
        this.configuration = configuration;
        CoinType.instances.push(this);
    }
    CoinType.newDustCalculation = function (dustRelayFee) {
        return new bignumber_js_1.BigNumber(dustRelayFee).div(1000).times(ASSUMED_TX_SIZE).round(0, bignumber_js_1.BigNumber.ROUND_UP).toString();
    };
    CoinType.oldDustCalculation = function (minRelayTxFee) {
        return new bignumber_js_1.BigNumber(minRelayTxFee).div(1000).times(3).times(ASSUMED_TX_SIZE).round(0, bignumber_js_1.BigNumber.ROUND_UP).toString();
    };
    CoinType.get = function (type) {
        return _.find(CoinType.instances, { name: coin_name_1.CoinName[type] });
    };
    CoinType.getByName = function (name) {
        return _.find(CoinType.instances, { name: name });
    };
    CoinType.getBySymbol = function (symbol) {
        var upperSymbol = symbol.toUpperCase();
        return _.find(CoinType.instances, { symbol: upperSymbol });
    };
    CoinType.getList = function () {
        return CoinType.instances;
    };
    CoinType.fromFeatureCoin = function (coin) {
        var config = _.find(CoinType.config, { name: coin.coin_name });
        if (config) {
            var instance = new CoinType(config);
            instance.isToken = false;
            instance.symbol = coin.coin_shortcut;
            instance.decimals = coin.decimals || config.defaultDecimals || 0;
            instance.coinTypeCode = (coin.bip44_account_path < 0x80000000) ?
                '' + coin.bip44_account_path : '' + (coin.bip44_account_path - 0x80000000) + '\'';
            instance.amountParameters = {
                DECIMAL_PLACES: instance.decimals,
                EXPONENTIAL_AT: [-(instance.decimals + 1), instance.decimals + 1]
            };
            if (!!coin.contract_address) {
                instance.isToken = true;
                instance.contractAddressString = "0x" + coin.contract_address.toHex();
                instance.gasLimitFromBuffer = coin.gas_limit;
            }
            return instance;
        }
    };
    Object.defineProperty(CoinType.prototype, "name", {
        get: function () {
            return this.configuration.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "addessFormat", {
        get: function () {
            return this.configuration.addressFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "dust", {
        get: function () {
            if (!this._dust) {
                this._dust = this.parseAmount(this.configuration.dust);
            }
            return this._dust;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "symbol", {
        get: function () {
            return this._symbol;
        },
        set: function (s) {
            this._symbol = s.toUpperCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "contractAddress", {
        get: function () {
            return this._contractAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "contractAddressString", {
        set: function (a) {
            if (a.startsWith('0x')) {
                this._contractAddress = ByteBuffer.fromHex(a.substr(2));
            }
            else {
                this._contractAddress = ByteBuffer.fromHex(a);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "gasLimitFromBuffer", {
        set: function (n) {
            this._gasLimit = this.number2Big(n);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "gasLimit", {
        get: function () {
            return this._gasLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "amountConstructor", {
        get: function () {
            console.assert(this._amountConstructor, 'AmountConstructor not set');
            return this._amountConstructor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "amountParameters", {
        set: function (config) {
            this._amountConstructor = bignumber_js_1.BigNumber.another(config);
        },
        enumerable: true,
        configurable: true
    });
    CoinType.prototype.parseAmount = function (amount) {
        return this.number2Big(amount);
    };
    CoinType.prototype.amountToFloat = function (amount) {
        return new this.amountConstructor(amount.toString())
            .shift(-this.decimals);
    };
    CoinType.prototype.floatToAmount = function (amount) {
        return new this.amountConstructor(amount)
            .shift(this.decimals);
    };
    CoinType.prototype.equals = function (other) {
        return other instanceof CoinType && this.name === other.name;
    };
    CoinType.prototype.toFeatureCoinMetadata = function () {
        return {
            addressFormat: this.addessFormat,
            amountParameters: {
                DECIMAL_PLACES: this.decimals + 1,
                EXPONENTIAL_AT: [-(this.decimals + 1), this.decimals + 1]
            },
            coinTypeCode: this.coinTypeCode,
            currencySymbol: this.symbol,
            decimals: this.decimals,
            dust: this.dust.toString(),
            name: this.name,
            isToken: this.isToken
        };
    };
    CoinType.prototype.number2Big = function (n) {
        if (n instanceof ByteBuffer) {
            return this.fromBuffer(n);
        }
        else if (n instanceof Long) {
            return new this.amountConstructor(n.toString());
        }
        else {
            return new this.amountConstructor(n);
        }
    };
    CoinType.prototype.fromBuffer = function (buffer) {
        return new this.amountConstructor(buffer.toHex() || "00", 16);
    };
    CoinType.instances = [];
    CoinType.config = [{
            name: coin_name_1.CoinName[coin_name_1.CoinName.Bitcoin],
            addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
            dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Litecoin],
            addressFormat: "^[L3][a-km-zA-HJ-NP-Z1-9]{26,33}$",
            dust: CoinType.newDustCalculation(LITECOIN_DUST_RELAY_FEE),
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Dogecoin],
            addressFormat: "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
            dust: "100000000",
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Ethereum],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Dash],
            addressFormat: "^X[a-km-zA-HJ-NP-Z1-9]{25,34}$",
            dust: CoinType.oldDustCalculation(DASH_MIN_RELAY_TX_FEE),
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.BitcoinCash],
            addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
            dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Aragon],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Augur],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.BAT],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Civic],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.district0x],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.FunFair],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 8
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Gnosis],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Golem],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.OmiseGo],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 18
        }, {
            name: coin_name_1.CoinName[coin_name_1.CoinName.Salt],
            addressFormat: ETHEREUM_ADDRESS_FORMAT,
            dust: 1,
            defaultDecimals: 8
        }];
    return CoinType;
}());
exports.CoinType = CoinType;
