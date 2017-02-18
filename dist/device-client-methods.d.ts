import { NodeVector } from "./node-vector";
import { DevicePolicyEnum } from "./global/device-policy-enum";
export declare type GetAddressFunction = {
    (nodePath: NodeVector, coinName: string): Promise<any>;
};
export declare type GetEthereumAddressFunction = {
    (nodePath: NodeVector, showDisplay: boolean): Promise<any>;
};
export declare type GetPublicKeyFunction = {
    (nodePath: NodeVector, showDisplay: boolean): Promise<any>;
};
export declare type ChangeLabelFunction = {
    (label: string): Promise<any>;
};
export declare type EnablePassphraseFunction = {
    (enabled: boolean): Promise<any>;
};
export declare type DecryptNodeVectorFunction = {
    (encrypted: string): Promise<any>;
};
export declare type CipherAccountNameFunction = {
    (node: NodeVector, value: string): Promise<any>;
};
export declare type SendPassphraseFunction = {
    (passphrase: string): Promise<any>;
};
export declare type EncryptNodeVectorFunction = {
    (node: NodeVector): Promise<any>;
};
export declare type FirmwareUploadFunction = {
    (): Promise<void>;
};
export declare type RecoveryDeviceFunction = {
    (options: DeviceRecoveryRequest): Promise<any>;
};
export declare type ResetDeviceFunction = {
    (options: ResetRequest): Promise<any>;
};
export declare type ApplyPolicyFunction = {
    (policy: DevicePolicyEnum, enabled: boolean): Promise<any>;
};
export interface DeviceRecoveryRequest {
    messageType: string;
    passphrase_protection: boolean;
    pin_protection: boolean;
    language: string;
    label: string;
    word_count: number;
    enforce_wordlist: boolean;
    use_character_cipher: boolean;
}
export interface ResetRequest {
    messageType: string;
    display_random: boolean;
    passphrase_protection: boolean;
    pin_protection: boolean;
    language: string;
    label: string;
}
