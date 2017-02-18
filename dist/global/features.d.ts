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
}
export interface IFeatures {
    bootloader_mode: boolean;
    initialized: boolean;
    device_id: string;
    available_firmware_version: string;
    deviceCapabilities: DeviceCapabilities;
    vendor: string;
    major_version: number;
    minor_version: number;
    patch_version: number;
    policies: Array<Policy>;
    coins: Array<IFeatureCoin>;
    coin_metadata: Array<CoinTypeConfiguration>;
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
    private findPolicy(policy);
}
