import * as _ from "lodash";
import {Features, IFeatureCoin, IFeatures} from "./global/features";
import {CoinType} from "./global/coin-type";

const FIRMWARE_METADATA_FILE: Array<FirmwareFileMetadata> = require('../dist/firmware.json');
const OFFICIAL_BOOTLOADER_HASHES = [
  '6397c446f6b9002a8b150bf4b9b4e0bb66800ed099b881ca49700139b0559f10', // v1.0.0
  'd544b5e06b0c355d68b868ac7580e9bab2d224a1e2440881cc1bca2b816752d5', // v1.0.1
  'cb222548a39ff6cbe2ae2f02c8d431c9ae0df850f814444911f521b95ab02f4c', // v1.0.3
  '770b30aaa0be884ee8621859f5d055437f894a5c9c7ca22635e7024e059857b7'  // v1.0.4
];

export class FeaturesService {
  private static deviceProfiles = require('../dist/device-profiles.json');

  private static getDeviceCapabilities(features: any): any {
    var deviceProfile: any = _.find(FeaturesService.deviceProfiles, (profile: any) => {
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

    this.addFeatureDataToCoinType(features.coins);

    //TODO There should be on canonical coin list that comes from the device
    features.coin_metadata = CoinType.getList().map((coin:CoinType) => coin.toFeatureCoinMetadata());
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

    let bootloaderHash: string = features.bootloader_mode ? '' : features.bootloader_hash.toHex();
    let isUnofficialBootloader = !features.bootloader_mode && !_.includes(OFFICIAL_BOOTLOADER_HASHES, bootloaderHash);
    if (!this._promise || !this.resolver) {
      if (isUnofficialBootloader) {
        this._promise = Promise.reject<Features>(
          `Unoffical bootloader detected. Please contact support. (${bootloaderHash})`);
      } else if (features.deviceCapabilities) {
        this._promise = Promise.resolve(new Features(features));
      } else {
        this._promise = Promise.reject<Features>('Unknown device or version');
      }
    } else {
      if (isUnofficialBootloader) {
        this.rejector(
          `Unoffical bootloader detected. Please contact support. (${bootloaderHash})`);
      } else if (features.deviceCapabilities) {
        this.resolver(new Features(features));
      } else {
        this.rejector('Unknown device or version');
      }
      this.resolver = undefined;
      this.rejector = undefined;
    }
  }

  private addFeatureDataToCoinType(coins: Array<IFeatureCoin>) {
    coins.forEach((coin) => {
      CoinType.fromFeatureCoin(coin);
    });
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
    CoinType.clearList();
  }
}
