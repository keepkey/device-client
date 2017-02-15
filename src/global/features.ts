import * as _ from 'lodash';

import {DevicePolicyEnum} from "./device-policy-enum";
import {CoinName} from "./coin-name";
import {CoinTypeConfiguration} from "./coin-type";

interface DeviceCapabilities {
  firmwareImageAvailable: boolean;
  defaultMnemonicSeedLength: number;
  supportsCipheredKeyRecovery: boolean;
  supportsSecureAccountTransfer: boolean;
}

interface Policy {
  policy_name: string;
  enabled: boolean;
}

interface IFeatureCoin {
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

export class Features {
  public get version(): string {
    return [
      this.data.major_version.toString(),
      this.data.minor_version.toString(),
      this.data.patch_version.toString()
    ].join('.');
  }

  public get initialized(): boolean {
    return this.data.initialized;
  }

  public get bootloaderMode(): boolean {
    return this.data.bootloader_mode;
  }

  public get supportsCipheredKeyRecovery(): boolean {
    return _.get<boolean>(this.data, 'deviceCapabilities.supportsCipheredKeyRecovery');
  }

  public get defaultMnemonicSeedLength(): number {
    return _.get<number>(this.data, 'deviceCapabilities.defaultMnemonicSeedLength');
  }

  public get usesShapeshiftResponseV2(): boolean {
    return _.get<boolean>(this.data, 'deviceCapabilities.usesShapeshiftResponseV2');
  }

  public get raw(): IFeatures {
    return this.data;
  }

  constructor(private data: IFeatures) {};

  public supportsPolicy(policy: DevicePolicyEnum): boolean {
    return !!(this.findPolicy(policy));
  }

  public policyEnabled(policy: DevicePolicyEnum): boolean {
    return _.get<boolean>(this.findPolicy(policy), 'enabled');
  }

  public supportsCoinType(coin: CoinName): boolean {
    var coinName: string = CoinName[coin];
    return !!(_.find(this.data.coin_metadata, {name: coinName}));
  }

  private findPolicy(policy: DevicePolicyEnum) {
    return _.find(this.data.policies, {
      policy_name: DevicePolicyEnum[policy]
    });
  }
}
