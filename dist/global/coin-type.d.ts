/// <reference types="bytebuffer" />
import * as ByteBuffer from 'bytebuffer';
import { BigNumber, Configuration as BigNumberConfig } from "bignumber.js";
import Long = require('long');
import { CoinName } from "./coin-name";
export interface CoinTypeConfiguration {
    name: string;
    currencySymbol: string;
    coinTypeCode: string;
    isToken: boolean;
    addressFormat: string;
    dust: number | string;
    decimals: number;
    amountParameters: Partial<BigNumberConfig>;
}
export declare class CoinType {
    configuration: CoinTypeConfiguration;
    private static instances;
    private static newDustCalculation(dustRelayFee);
    private static oldDustCalculation(minRelayTxFee);
    static get(type: CoinName): CoinType;
    static getByName(name: string): CoinType;
    static getBySymbol(symbol: string): CoinType;
    static getList(): Array<CoinTypeConfiguration>;
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
    readonly coinTypeCode: string;
    readonly addessFormat: string;
    readonly isToken: boolean;
    private _dust;
    readonly dust: BigNumber;
    private _amountConstructor;
    private readonly amountConstructor;
    parseAmount(amount: number | BigNumber | string | ByteBuffer): BigNumber;
    amountToFloat(amount: Long | string): BigNumber;
    floatToAmount(amount: number | BigNumber | string): BigNumber;
    equals(other: any): boolean;
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
