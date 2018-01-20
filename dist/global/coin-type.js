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
var CoinType = (function () {
    function CoinType(configuration) {
        this.configuration = configuration;
        this._dust = this.parseAmount(this.configuration.dust);
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
        return _.map(CoinType.instances, function (coinType) {
            return coinType.configuration;
        });
    };
    Object.defineProperty(CoinType.prototype, "name", {
        get: function () {
            return this.configuration.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "symbol", {
        get: function () {
            return this.configuration.currencySymbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "decimals", {
        get: function () {
            return this.configuration.decimals;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "coinTypeCode", {
        get: function () {
            return this.configuration.coinTypeCode;
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
    Object.defineProperty(CoinType.prototype, "isToken", {
        get: function () {
            return this.configuration.isToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "dust", {
        get: function () {
            return this._dust;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoinType.prototype, "amountConstructor", {
        get: function () {
            if (!this._amountConstructor) {
                this._amountConstructor = bignumber_js_1.BigNumber.another(this.configuration.amountParameters);
            }
            return this._amountConstructor;
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
    CoinType.Bitcoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Bitcoin],
        currencySymbol: 'BTC',
        coinTypeCode: "0'",
        isToken: false,
        addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8
        }
    });
    CoinType.Litecoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Litecoin],
        currencySymbol: 'LTC',
        coinTypeCode: "2'",
        isToken: false,
        addressFormat: "^[L3][a-km-zA-HJ-NP-Z1-9]{26,33}$",
        dust: CoinType.newDustCalculation(LITECOIN_DUST_RELAY_FEE),
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8
        }
    });
    CoinType.Dogecoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Dogecoin],
        currencySymbol: 'DOGE',
        coinTypeCode: "3'",
        isToken: false,
        addressFormat: "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
        dust: "100000000",
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8
        }
    });
    CoinType.Ethereum = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Ethereum],
        currencySymbol: 'ETH',
        coinTypeCode: "60'",
        isToken: false,
        addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.Dash = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Dash],
        currencySymbol: 'DASH',
        coinTypeCode: "5'",
        isToken: false,
        addressFormat: "^X[a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.oldDustCalculation(DASH_MIN_RELAY_TX_FEE),
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8
        }
    });
    CoinType.BitcoinCash = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.BitcoinCash],
        currencySymbol: 'BCH',
        coinTypeCode: "145'",
        isToken: false,
        addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8
        }
    });
    CoinType.Aragon = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Aragon],
        currencySymbol: 'ANT',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.Augur = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Augur],
        currencySymbol: 'REP',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.BAT = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.BAT],
        currencySymbol: 'BAT',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.Civic = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Civic],
        currencySymbol: 'CVC',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8,
            EXPONENTIAL_AT: [-9, 9]
        }
    });
    CoinType.district0x = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.district0x],
        currencySymbol: 'DNT',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.FunFair = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.FunFair],
        currencySymbol: 'FUN',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8,
            EXPONENTIAL_AT: [-9, 9]
        }
    });
    CoinType.Gnosis = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Gnosis],
        currencySymbol: 'GNO',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.Golem = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Golem],
        currencySymbol: 'GNT',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.OmiseGo = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.OmiseGo],
        currencySymbol: 'OMG',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 18,
        amountParameters: {
            DECIMAL_PLACES: 18,
            EXPONENTIAL_AT: [-19, 9]
        }
    });
    CoinType.Salt = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Salt],
        currencySymbol: 'SALT',
        coinTypeCode: CoinType.Ethereum.coinTypeCode,
        isToken: true,
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
        decimals: 8,
        amountParameters: {
            DECIMAL_PLACES: 8,
            EXPONENTIAL_AT: [-9, 9]
        }
    });
    return CoinType;
}());
exports.CoinType = CoinType;
