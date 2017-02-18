/// <reference types="long" />
import { CoinName } from "./coin-name";
import { BigNumber, Configuration } from "bignumber.js";
import Long = require('long');
export interface CoinTypeConfiguration {
    name: string;
    currencySymbol: string;
    coinTypeCode: string;
    addressFormat: string;
    dust: number | string;
    decimals: number;
    amountParameters: Configuration;
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
    readonly dust: BigNumber;
    private _amountConstructor;
    private readonly amountConstructor;
    parseAmount(amount: number | BigNumber | string): any;
    amountToFloat(amount: Long | string): BigNumber;
    floatToAmount(amount: number | BigNumber | string): BigNumber;
    equals(other: any): boolean;
    constructor(configuration: CoinTypeConfiguration);
}
