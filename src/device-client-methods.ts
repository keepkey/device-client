import {NodeVector} from "./node-vector";
import {DevicePolicyEnum} from "./global/device-policy-enum";

export type GetAddressFunction = {
  (nodePath: NodeVector, coinName: string): Promise<any>;
}

export type GetEthereumAddressFunction = {
  (nodePath: NodeVector, showDisplay: boolean): Promise<any>;
}

export type GetPublicKeyFunction = {
  (nodePath: NodeVector, showDisplay: boolean): Promise<any>;
}

export type ChangeLabelFunction = {
  (label: string): Promise<any>;
}

export type EnablePassphraseFunction = {
  (enabled: boolean): Promise<any>;
}

export type DecryptNodeVectorFunction = {
  (encrypted: string): Promise<any>;
}

export type CipherAccountNameFunction = {
  (node: NodeVector, value: string): Promise<any>;
}

export type SendPassphraseFunction = {
  (passphrase: string): Promise<any>;
}

export type EncryptNodeVectorFunction = {
  (node: NodeVector): Promise<any>;
}

export type FirmwareUploadFunction = {
  (): Promise<void>;
}

export type VerifyDevice = {
  (): Promise<void>;
}

export type RecoveryDeviceFunction = {
  (options: DeviceRecoveryRequest): Promise<any>;
}

export type ResetDeviceFunction = {
  (options: ResetRequest): Promise<any>;
}

export type ApplyPolicyFunction = {
  (policy: DevicePolicyEnum, enabled: boolean): Promise<any>;
}

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
