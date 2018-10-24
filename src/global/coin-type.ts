import * as _ from "lodash";
import * as ByteBuffer from'bytebuffer';
import {BigNumber} from "bignumber.js";
import Long = require('long');

import {CoinName} from "./coin-name";
import {IFeatureCoin} from "./features";

export interface CoinTypeConfiguration {
  name: string,
  addressFormat: string;
  dust: number | string;
  defaultDecimals?: number;
  exchangeForbidden?: boolean;
}

//TODO Addresses should be validated using the address validation checks from the core client. Using regexp allows checksum errors.
//TODO There should be on cononical coin list that comes from the device. This class should go away.

const ASSUMED_TX_SIZE = 182;
const BITCOIN_DUST_RELAY_FEE = 3000; // From bitcoin source code
const LITECOIN_DUST_RELAY_FEE = 100000; // https://github.com/litecoin-project/litecoin/blob/master/src/policy/policy.h#L48
const DASH_MIN_RELAY_TX_FEE = 10000; // https://github.com/dashpay/dash/blob/master/src/wallet/wallet.h#L57

const ETHEREUM_ADDRESS_FORMAT = "^(0x)?[0-9a-fA-F]{40}$";

export class CoinType {
  private static instances: Array<CoinType> = [];

  private static newDustCalculation(dustRelayFee: number | BigNumber | string): string {
    return new BigNumber(dustRelayFee).div(1000).times(ASSUMED_TX_SIZE).decimalPlaces(0, BigNumber.ROUND_UP).toString();
  }

  private static oldDustCalculation(minRelayTxFee: number | BigNumber | string): string {
    return new BigNumber(minRelayTxFee).div(1000).times(3).times(ASSUMED_TX_SIZE).decimalPlaces(0, BigNumber.ROUND_UP).toString();
  }

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

  public static getList(): Array<CoinType> {
    return CoinType.instances;
  }

  public static clearList() {
    CoinType.instances.length = 0;
  }

  public static fromFeatureCoin(coin: IFeatureCoin) {
    let config: CoinTypeConfiguration = _.find(CoinType.config, {name: coin.coin_name});
    if (!config) {
      console.warn(`Coin ${coin.coin_name} was skipped. It doesn't have a configuration defined.`)
    } else if (!CoinType.get(CoinName[coin.coin_name])) {
      let instance = new CoinType(config);

      instance.isToken = false;
      instance.symbol = coin.coin_shortcut;
      instance.decimals = coin.decimals || config.defaultDecimals || 0;
      instance.coinTypeCode = (coin.bip44_account_path < 0x80000000) ?
        '' + coin.bip44_account_path : '' + (coin.bip44_account_path - 0x80000000) + '\'';
      instance.amountParameters = {
        DECIMAL_PLACES: instance.decimals,
        EXPONENTIAL_AT: [-(instance.decimals + 1), 40]
      };

      instance.pubkeyhash = coin.address_type;
      instance.scripthash = coin.address_type_p2sh;

      if (!!coin.contract_address) {
        // it is an ERC20 token
        instance.isToken = true;
        instance.contractAddressString = "0x"+coin.contract_address.toHex();
        instance.gasLimitFromBuffer = coin.gas_limit;
      }

      CoinType.instances.push(instance);

      return instance;
    }
  }

  // expose configuration values
  public get name(): string {
    return this.configuration.name;
  }

  public get addessFormat(): string {
    return this.configuration.addressFormat;
  }

  private _dust: BigNumber;
  public get dust(): BigNumber {
    if (!this._dust) {
      this._dust = this.parseAmount(this.configuration.dust)
    }
    return this._dust;
  }

  // properties that are set from IFeatureCoin
  public decimals: number;
  public coinTypeCode: string;
  public isToken: boolean;
  public exchangeForbidden: boolean;
  public pubkeyhash: number;
  public scripthash: number;

  private _symbol: string;
  public get symbol(): string {
    return this._symbol;
  }
  public set symbol(s: string) {
    this._symbol = s.toUpperCase();
  }

  private _contractAddress: ByteBuffer;
  public get contractAddress(): ByteBuffer {
    return this._contractAddress;
  }
  public set contractAddressString(a: string) {
    if (a.startsWith('0x')) {
      this._contractAddress = ByteBuffer.fromHex(a.substr(2));
    } else {
      this._contractAddress = ByteBuffer.fromHex(a);
    }
  }

  private _gasLimit: BigNumber;
  public set gasLimitFromBuffer(n: ByteBuffer) {
    this._gasLimit = this.number2Big(n);
  }
  public get gasLimit(): BigNumber {
    return this._gasLimit;
  }

  private _amountConstructor: typeof BigNumber;
  private get amountConstructor(): typeof BigNumber {
    console.assert(this._amountConstructor, 'AmountConstructor not set');
    return this._amountConstructor;
  }
  public set amountParameters(config: Partial<BigNumber.Config>) {
    this._amountConstructor = BigNumber.clone(config);
  }

  // public methods
  public parseAmount(amount: number | BigNumber | string | ByteBuffer): BigNumber {
    return this.number2Big(amount);
  }

  public amountToFloat(amount: Long | string): BigNumber {
    return new this.amountConstructor(amount.toString())
      .shiftedBy(-this.decimals);
  }

  public floatToAmount(amount: number | BigNumber | string): BigNumber {
    return new this.amountConstructor(amount)
        .shiftedBy(this.decimals);
  }

  public equals(other: any): boolean {
    return other instanceof CoinType && this.name === other.name;
  }

  public toFeatureCoinMetadata() {
    return {
      addressFormat: this.addessFormat,
      amountParameters: {
        DECIMAL_PLACES: this.decimals + 1,
        EXPONENTIAL_AT: [ -(this.decimals + 1), 40]
      },
      coinTypeCode: this.coinTypeCode,
      currencySymbol: this.symbol,
      decimals: this.decimals,
      dust: this.dust.toString(),
      name: this.name,
      isToken: this.isToken,
      exchangeForbidden: this.exchangeForbidden,
    }
  }

  private constructor(public configuration: CoinTypeConfiguration) {
    this.exchangeForbidden = !!this.configuration.exchangeForbidden;
  }

  private number2Big(n: ByteBuffer | Long | number | string | BigNumber): BigNumber {
    if (n instanceof ByteBuffer) {
      return this.fromBuffer(n);
    } else if (n instanceof Long) {
      return new this.amountConstructor(n.toString());
    } else {
      return new this.amountConstructor(n);
    }
  }

  private fromBuffer(buffer: ByteBuffer): BigNumber {
    return new this.amountConstructor(buffer.toHex() || "00", 16);
  }

  // Create all instances
  private static config: Array<CoinTypeConfiguration> = [{
    name            : CoinName[CoinName.Bitcoin],
    addressFormat   : "(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^(bc1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Litecoin],
    addressFormat   : "(^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$)|(^(ltc1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
    dust            : CoinType.newDustCalculation(LITECOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Dogecoin],
    addressFormat   : "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
    dust            : "100000000",
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Ethereum],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Dash],
    addressFormat   : "^[X7][a-km-zA-HJ-NP-Z1-9]{25,34}$",
    dust            : CoinType.oldDustCalculation(DASH_MIN_RELAY_TX_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.BitcoinCash],
    addressFormat   : "(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^bitcoincash:[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{25,55}$)|(^bitcoincash:[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{25,55}$)",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.BitcoinGold],
    addressFormat   : "(^[AG][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^(btg1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Bitcore],
    addressFormat   : "(^[2s][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^(btg1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Zcash],
    addressFormat   : "^t1[a-km-zA-HJ-NP-Z1-9]{33}$",
    dust            : CoinType.newDustCalculation(BITCOIN_DUST_RELAY_FEE),
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Aragon],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Augur],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.BAT],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Civic],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.district0x],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.FunFair],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Gnosis],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Golem],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.OmiseGo],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.SALT],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Bancor],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.SingularDTV],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 0
  }, {
    name            : CoinName[CoinName.ICONOMI],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.DigixDAO],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 9
  }, {
    name            : CoinName[CoinName.Melon],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.SwarmCity],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Wings],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.WeTrust],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 6
  }, {
    name            : CoinName[CoinName.iExec],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 9
  }, {
    name            : CoinName[CoinName.Matchpool],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 3,
    exchangeForbidden: true, // Disabled for exchange because expected withdrawal amount calculation differs from SS calculation
  }, {
    name            : CoinName[CoinName.Status],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Numeraire],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Edgeless],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 0,
    exchangeForbidden: true, // Disabled for exchange because expected withdrawal amount calculation differs from SS calculation
  }, {
    name            : CoinName[CoinName.Metal],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.TenX],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : "Qtum ICO Token",
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : "0x",
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.FirstBlood],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.RCN],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Storj],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.BinanceCoin],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Tether],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 6
  }, {
    name            : CoinName[CoinName.PolyMath],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Zilliqa],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 12
  }, {
    name            : CoinName[CoinName.Decentraland],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : "0xBitcoin",
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Gifto],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 5
  }, {
    name            : CoinName[CoinName.IOSToken],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Aelf],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.TrueUSD],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Aeternity],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Maker],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.Dai],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.SpankChain],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : CoinName[CoinName.CyberMiles],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 18
  }, {
    name            : "Crypto.com",
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }, {
    name            : CoinName[CoinName.Populous],
    addressFormat   : ETHEREUM_ADDRESS_FORMAT,
    dust            : 1,
    defaultDecimals : 8
  }];
}

