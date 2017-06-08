/// <reference types="bignumber.js" />
/// <reference types="long" />
import { CoinName } from "./coin-name";
import Long = require('long');
import * as BigNumber from "bignumber.js";
export interface CoinTypeConfiguration {
    name: string;
    currencySymbol: string;
    coinTypeCode: string;
    addressFormat: string;
    dust: number | string;
    decimals: number;
    amountParameters: Partial<BigNumber.BigNumberConfig>;
}
export declare class CoinType {
    private configuration;
    private static instances;
    static Bitcoin: CoinType;
    static Litecoin: CoinType;
    static Dogecoin: CoinType;
    static Ethereum: CoinType;
    static Dash: CoinType;
    static get(type: CoinName): CoinType;
    static getByName(name: string): CoinType;
    static getBySymbol(symbol: string): CoinType;
    static getList(): Array<CoinTypeConfiguration>;
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
    readonly coinTypeCode: string;
    private _dust;
    readonly dust: BigNumber.BigNumber;
    private _amountConstructor;
    private readonly amountConstructor;
    parseAmount(amount: number | BigNumber.BigNumber | string): any;
    amountToFloat(amount: Long | string): BigNumber.BigNumber;
    floatToAmount(amount: number | BigNumber.BigNumber | string): BigNumber.BigNumber;
    equals(other: any): boolean;
    constructor(configuration: CoinTypeConfiguration);
}
