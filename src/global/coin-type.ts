import * as _ from "lodash";
import {CoinName} from "./coin-name";
import {BigNumber, Configuration} from "bignumber.js";
import Long = require('long');

export interface CoinTypeConfiguration {
  name: string,
  currencySymbol: string;
  coinTypeCode: string;
  addressFormat: string;
  dust: number | string;
  decimals: number;
  amountParameters: Configuration;
}

//TODO Addresses should be validated using the address validation checks from the core client. Using regexp allows checksum errors.

export class CoinType {
  private static instances: Array<CoinType> = [];

  public static Bitcoin = new CoinType({
    name            : CoinName[CoinName.Bitcoin],
    currencySymbol  : 'BTC',
    coinTypeCode    : "0'",
    addressFormat   : "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
    dust            : 546,
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Litecoin = new CoinType({
    name            : CoinName[CoinName.Litecoin],
    currencySymbol  : 'LTC',
    coinTypeCode    : "2'",
    addressFormat   : "^[L3][a-km-zA-HJ-NP-Z1-9]{26,33}$",
    dust            : 100000,
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Dogecoin = new CoinType({
    name            : CoinName[CoinName.Dogecoin],
    currencySymbol  : 'DOGE',
    coinTypeCode    : "3'",
    addressFormat   : "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
    dust            : "100000000",
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Ethereum = new CoinType({
    name            : CoinName[CoinName.Ethereum],
    currencySymbol  : 'ETH',
    coinTypeCode    : "60'",
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Dash = new CoinType({
    name            : CoinName[CoinName.Dash],
    currencySymbol  : 'DASH',
    coinTypeCode    : "5'",
    addressFormat   : "^X[a-km-zA-HJ-NP-Z1-9]{25,34}$", //TODO
    dust            : 546, //TODO
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });

  public static get(type: CoinName): CoinType {
    return _.find(CoinType.instances, {name: CoinName[type]});
  }

  public static getByName(name: string): CoinType {
    return _.find(CoinType.instances, {name: name});
  }

  public static getBySymbol(symbol: string): CoinType {
    var upperSymbol = symbol.toUpperCase();
    return _.find(CoinType.instances, {symbol: upperSymbol});
  }

  public static getList(): Array<CoinTypeConfiguration> {
    return _.map(CoinType.instances, (coinType: CoinType) => {
      return coinType.configuration;
    });
  }

  public get name(): string {
    return this.configuration.name;
  }

  public get symbol(): string {
    return this.configuration.currencySymbol;
  }

  public get decimals(): number {
    return this.configuration.decimals;
  }

  public get coinTypeCode(): string {
    return this.configuration.coinTypeCode;
  }

  private _dust: BigNumber = this.parseAmount(this.configuration.dust);
  public get dust(): BigNumber {
    return this._dust;
  }

  private _amountConstructor;
  private get amountConstructor() {
    if (!this._amountConstructor) {
      this._amountConstructor = BigNumber.another(this.configuration.amountParameters);
    }
    return this._amountConstructor
  }

  public parseAmount(amount: number | BigNumber | string) {
    return new this.amountConstructor(amount);
  }

  public amountToFloat(amount: Long | string): BigNumber {
    return new this.amountConstructor(amount.toString())
      .shift(-this.decimals);
  }

  public floatToAmount(amount: number | BigNumber | string): BigNumber {
    return new this.amountConstructor(amount)
        .shift(this.decimals);
  }

  public equals(other: any) {
    return other instanceof CoinType && this.name === other.name;
  }

  constructor(private configuration: CoinTypeConfiguration) {
    CoinType.instances.push(this);
  }
}
