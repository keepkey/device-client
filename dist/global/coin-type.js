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
    CoinType.prototype.decorateWithFeatureCoin = function (coin) {
        this.isToken = false;
        this.symbol = coin.coin_shortcut;
        this.decimals = coin.decimals;
        this.coinTypeCode = (coin.bip44_account_path < 0x80000000) ?
            '' + coin.bip44_account_path : '' + (coin.bip44_account_path - 0x80000000) + '\'';
        this.amountParameters = {
            DECIMAL_PLACES: coin.decimals,
            EXPONENTIAL_AT: [-(coin.decimals + 1), coin.decimals + 1]
        };
        if (!!coin.contract_address) {
            this.isToken = true;
            this.contractAddressString = coin.contract_address;
            this.gasLimitFromBuffer = coin.gas_limit;
        }
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
    CoinType.Bitcoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Bitcoin],
        addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    });
    CoinType.Litecoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Litecoin],
        addressFormat: "^[L3][a-km-zA-HJ-NP-Z1-9]{26,33}$",
        dust: CoinType.newDustCalculation(LITECOIN_DUST_RELAY_FEE),
    });
    CoinType.Dogecoin = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Dogecoin],
        addressFormat: "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
        dust: "100000000",
    });
    CoinType.Ethereum = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Ethereum],
        addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
        dust: 1
    });
    CoinType.Dash = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Dash],
        addressFormat: "^X[a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.oldDustCalculation(DASH_MIN_RELAY_TX_FEE),
    });
    CoinType.BitcoinCash = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.BitcoinCash],
        addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
        dust: CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    });
    CoinType.Aragon = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Aragon],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.Augur = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Augur],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.BAT = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.BAT],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.Civic = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Civic],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.district0x = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.district0x],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.FunFair = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.FunFair],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.Gnosis = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Gnosis],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.Golem = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Golem],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.OmiseGo = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.OmiseGo],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    CoinType.Salt = new CoinType({
        name: coin_name_1.CoinName[coin_name_1.CoinName.Salt],
        addressFormat: CoinType.Ethereum.addessFormat,
        dust: 1,
    });
    return CoinType;
}());
exports.CoinType = CoinType;
