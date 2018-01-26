/// <reference types="bytebuffer" />
import * as ByteBuffer from 'bytebuffer';
import { BigNumber, Configuration as BigNumberConfig } from "bignumber.js";
import Long = require('long');
import { CoinName } from "./coin-name";
import { IFeatureCoin } from "./features";
export interface CoinTypeConfiguration {
    name: string;
    addressFormat: string;
    dust: number | string;
}
export declare class CoinType {
    configuration: CoinTypeConfiguration;
    private static instances;
    private static newDustCalculation(dustRelayFee);
    private static oldDustCalculation(minRelayTxFee);
    static get(type: CoinName): CoinType;
    static getByName(name: string): CoinType;
    static getBySymbol(symbol: string): CoinType;
    static getList(): Array<CoinType>;
    readonly name: string;
    readonly addessFormat: string;
    private _dust;
    readonly dust: BigNumber;
    decimals: number;
    coinTypeCode: string;
    isToken: boolean;
    private _symbol;
    symbol: string;
    private _contractAddress;
    readonly contractAddress: ByteBuffer;
    contractAddressString: string;
    private _gasLimit;
    gasLimitFromBuffer: ByteBuffer;
    readonly gasLimit: BigNumber;
    private _amountConstructor;
    private readonly amountConstructor;
    amountParameters: Partial<BigNumberConfig>;
    parseAmount(amount: number | BigNumber | string | ByteBuffer): BigNumber;
    amountToFloat(amount: Long | string): BigNumber;
    floatToAmount(amount: number | BigNumber | string): BigNumber;
    equals(other: any): boolean;
    decorateWithFeatureCoin(coin: IFeatureCoin): void;
    toFeatureCoinMetadata(): {
        addressFormat: string;
        amountParameters: {
            DECIMAL_PLACES: number;
            EXPONENTIAL_AT: number[];
        };
        coinTypeCode: string;
        currencySymbol: string;
        decimals: number;
        dust: string;
        name: string;
        isToken: boolean;
    };
    constructor(configuration: CoinTypeConfiguration);
    private number2Big(n);
    private fromBuffer(buffer);
    static Bitcoin: CoinType;
    static Litecoin: CoinType;
    static Dogecoin: CoinType;
    static Ethereum: CoinType;
    static Dash: CoinType;
    static BitcoinCash: CoinType;
    static Aragon: CoinType;
    static Augur: CoinType;
    static BAT: CoinType;
    static Civic: CoinType;
    static district0x: CoinType;
    static FunFair: CoinType;
    static Gnosis: CoinType;
    static Golem: CoinType;
    static OmiseGo: CoinType;
    static Salt: CoinType;
}
