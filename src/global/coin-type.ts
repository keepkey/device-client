import * as _ from "lodash";
import {CoinName} from "./coin-name";
import Long = require('long');
import * as BigNumber from "bignumber.js";
import * as ByteBuffer from "bytebuffer";

const BN = BigNumber.BigNumber;

export interface CoinTypeConfiguration {
  name: string,
  currencySymbol: string;
  coinTypeCode: string;
  isToken: boolean;
  addressFormat: string;
  dust: number | string;
  decimals: number;
  amountParameters: Partial<BigNumber.Configuration>;
}

//TODO Addresses should be validated using the address validation checks from the core client. Using regexp allows checksum errors.

const ASSUMED_TX_SIZE = 182;
const BITCOIN_DUST_RELAY_FEE = 3000; // From bitcoin source code
const LITECOIN_DUST_RELAY_FEE = 100000; // https://github.com/litecoin-project/litecoin/blob/master/src/policy/policy.h#L48
const DASH_MIN_RELAY_TX_FEE = 10000; // https://github.com/dashpay/dash/blob/master/src/wallet/wallet.h#L57

export class CoinType {
  private static instances: Array<CoinType> = [];

  private static newDustCalculation(dustRelayFee: number | BigNumber.BigNumber | string): string {
    return new BN(dustRelayFee).div(1000).times(ASSUMED_TX_SIZE).round(0, BN.ROUND_UP).toString();
  }

  private static oldDustCalculation(minRelayTxFee: number | BigNumber.BigNumber | string): string {
    return new BN(minRelayTxFee).div(1000).times(3).times(ASSUMED_TX_SIZE).round(0, BN.ROUND_UP).toString();
  }

  public static Bitcoin = new CoinType({
    name            : CoinName[CoinName.Bitcoin],
    currencySymbol  : 'BTC',
    coinTypeCode    : "0'",
    isToken         : false,
    addressFormat   : "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Litecoin = new CoinType({
    name            : CoinName[CoinName.Litecoin],
    currencySymbol  : 'LTC',
    coinTypeCode    : "2'",
    isToken         : false,
    addressFormat   : "^[L3][a-km-zA-HJ-NP-Z1-9]{26,33}$",
    dust            : CoinType.newDustCalculation(LITECOIN_DUST_RELAY_FEE),
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Dogecoin = new CoinType({
    name            : CoinName[CoinName.Dogecoin],
    currencySymbol  : 'DOGE',
    coinTypeCode    : "3'",
    isToken         : false,
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
    isToken         : false,
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
    isToken         : false,
    addressFormat   : "^X[a-km-zA-HJ-NP-Z1-9]{25,34}$", //TODO
    dust            : CoinType.oldDustCalculation(DASH_MIN_RELAY_TX_FEE),
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static BitcoinCash = new CoinType({
    name            : CoinName[CoinName.BitcoinCash],
    currencySymbol  : 'BCH',
    coinTypeCode    : "145'",
    isToken         : false,
    addressFormat   : "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8
    }
  });
  public static Aragon = new CoinType({
    name            : CoinName[CoinName.Aragon],
    currencySymbol  : 'ANT',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Augur = new CoinType({
    name            : CoinName[CoinName.Augur],
    currencySymbol  : 'REP',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static BAT = new CoinType({
    name            : CoinName[CoinName.BAT],
    currencySymbol  : 'BAT',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Civic = new CoinType({
    name            : CoinName[CoinName.Civic],
    currencySymbol  : 'CVC',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static district0x = new CoinType({
    name            : CoinName[CoinName.district0x],
    currencySymbol  : 'DNT',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static FunFair = new CoinType({
    name            : CoinName[CoinName.FunFair],
    currencySymbol  : 'FUN',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Gnosis = new CoinType({
    name            : CoinName[CoinName.Gnosis],
    currencySymbol  : 'GNO',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Golem = new CoinType({
    name            : CoinName[CoinName.Golem],
    currencySymbol  : 'GNT',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static OmiseGo = new CoinType({
    name            : CoinName[CoinName.OmiseGo],
    currencySymbol  : 'OMG',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 18,
    amountParameters: {
      DECIMAL_PLACES: 18,
      EXPONENTIAL_AT: [-19, 9]
    }
  });
  public static Salt = new CoinType({
    name            : CoinName[CoinName.Salt],
    currencySymbol  : 'SALT',
    coinTypeCode    : "60'",
    isToken         : true,
    addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
    dust            : 1,
    decimals        : 8,
    amountParameters: {
      DECIMAL_PLACES: 8,
      EXPONENTIAL_AT: [-19, 9]
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

  public get isToken(): boolean {
    return this.configuration.isToken;
  }

  private _dust: BigNumber.BigNumber = this.parseAmount(this.configuration.dust);
  public get dust(): BigNumber.BigNumber {
    return this._dust;
  }

  private _amountConstructor;
  private get amountConstructor() {
    if (!this._amountConstructor) {
      this._amountConstructor = BN.another(this.configuration.amountParameters);
    }
    return this._amountConstructor
  }

  public parseAmount(amount: number | BigNumber.BigNumber | string | ByteBuffer) {
    return this.number2Big(amount);
  }

  public amountToFloat(amount: Long | string): BigNumber.BigNumber {
    return new this.amountConstructor(amount.toString())
      .shift(-this.decimals);
  }

  public floatToAmount(amount: number | BigNumber.BigNumber | string): BigNumber.BigNumber {
    return new this.amountConstructor(amount)
        .shift(this.decimals);
  }

  public equals(other: any) {
    return other instanceof CoinType && this.name === other.name;
  }

  constructor(public configuration: CoinTypeConfiguration) {
    CoinType.instances.push(this);
  }

  private number2Big(n: ByteBuffer | Long | number | string | BigNumber.BigNumber): BigNumber.BigNumber {
    if (n instanceof ByteBuffer) {
      return this.fromBuffer(n);
    } else if (n instanceof Long) {
      return new this.amountConstructor(n.toString());
    } else {
      return new this.amountConstructor(n);
    }
  }

  private fromBuffer(buffer: ByteBuffer): BigNumber.BigNumber {
    return new this.amountConstructor(buffer.toHex() || "00", 16);
  }
}
