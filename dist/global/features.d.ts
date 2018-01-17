import { BigNumber } from "bignumber.js";
import { DevicePolicyEnum } from "./device-policy-enum";
import { CoinName } from "./coin-name";
import { CoinTypeConfiguration } from "./coin-type";
export interface DeviceCapabilities {
    firmwareImageAvailable: boolean;
    defaultMnemonicSeedLength: number;
    supportsCipheredKeyRecovery: boolean;
    supportsSecureAccountTransfer: boolean;
}
export interface Policy {
    policy_name: string;
    enabled: boolean;
}
export interface IFeatureCoin {
    coin_name: string;
    coin_shortcut: string;
    address_type: number;
    maxfee_kb: string;
    address_type_p2sh: number;
    address_type_p2wpkh: number;
    address_type_p2wsh: number;
    signed_message_header: string;
    bip44_account_path: number;
    forkid: number;
    decimals: number;
    contract_address: string;
    gas_limit: BigNumber;
}
export interface IFeatures {
    available_firmware_version: string;
    bootloader_hash: string;
    bootloader_mode: any;
    coins: Array<IFeatureCoin>;
    device_id: string;
    initialized: boolean;
    label: string;
    language: string;
    major_version: number;
    minor_version: number;
    passphrase_cached: boolean;
    passphrase_protection: boolean;
    patch_version: number;
    pin_cached: boolean;
    pin_protection: boolean;
    policies: Array<Policy>;
    revision: string;
    vendor: string;
    coin_metadata: Array<CoinTypeConfiguration>;
    deviceCapabilities: DeviceCapabilities;
    model: string;
}
export declare class Features {
    private data;
    readonly version: string;
    readonly initialized: boolean;
    readonly bootloaderMode: boolean;
    readonly supportsCipheredKeyRecovery: boolean;
    readonly defaultMnemonicSeedLength: number;
    readonly usesShapeshiftResponseV2: boolean;
    readonly raw: IFeatures;
    constructor(data: IFeatures);
    supportsPolicy(policy: DevicePolicyEnum): boolean;
    policyEnabled(policy: DevicePolicyEnum): boolean;
    supportsCoinType(coin: CoinName): boolean;
    readonly model: string;
    private findPolicy(policy);
}
