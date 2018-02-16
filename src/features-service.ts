import * as _ from "lodash";
import {Features, IFeatures} from "./global/features";
import {CoinType} from "./global/coin-type";

const FIRMWARE_METADATA_FILE: Array<FirmwareFileMetadata> = require('../dist/firmware.json');

export class FeaturesService {
  private static deviceProfiles = require('../dist/device-profiles.json');

  private static getDeviceCapabilities(features: any): any {
    var deviceProfile = _.find(FeaturesService.deviceProfiles, (profile: any) => {
      return !!(_.find([features], profile.identity));
    });

    if (!deviceProfile) {
      console.error('Unknown device or version');
      return undefined;
    } else {
      return deviceProfile.capabilities;
    }
  }

  private resolver: Function;
  private rejector: Function;
  private _promise: Promise<Features>;

  public setValue(features: IFeatures): void {
    features.deviceCapabilities = FeaturesService.getDeviceCapabilities(features);
    features.coin_metadata = _.intersectionWith(CoinType.getList(), features.coins, (metadata, deviceCoin) => {
      return metadata.name === deviceCoin.coin_name;
    });
    features.version = `v${features.major_version}.${features.minor_version}.${features.patch_version}`;

    if (features.bootloader_mode) {
      // Override the version number for older devices that don't have a model number specified
      switch (features.version) {
        case 'v1.0.0':
        case 'v1.0.1':
        case 'v1.0.2':
        case 'v1.0.3':
          features.model = 'K1-14AM';
          break;
        case 'v1.0.4':
          features.model = 'K1-14WL-S';
          break;
      }
    }

    if (!features.model) {
      features.model = 'K1-14AM';
    }

    features.available_firmware_version = _.find(FIRMWARE_METADATA_FILE, {modelNumber: features.model}).version;

    if (!this._promise || !this.resolver) {
      if (features.deviceCapabilities) {
        this._promise = Promise.resolve(new Features(features));
      } else {
        this._promise = Promise.reject<Features>('Unknown device or version');
      }
    } else {
      if (features.deviceCapabilities) {
        this.resolver(new Features(features));
      } else {
        this.rejector('Unknown device or version');
      }
      this.resolver = undefined;
      this.rejector = undefined;
    }
  }

  public get promise(): Promise<Features> {
    if (!this._promise) {
      this._promise = new Promise((resolve, reject) => {
        this.resolver = resolve;
        this.rejector = reject;
      });
    }
    return this._promise;
  }

  public clear() {
    this._promise = undefined;
    this.resolver = undefined;
  }
}
