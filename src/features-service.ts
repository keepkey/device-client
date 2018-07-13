import * as _ from "lodash";
import {BootloaderInfo, DeviceProfile, Features, IFeatureCoin, IFeatures} from "./global/features";
import {CoinType} from "./global/coin-type";

const FIRMWARE_METADATA_FILE: Array<FirmwareFileMetadata> = require('../dist/firmware.json');
const OFFICIAL_BOOTLOADER_HASHES: Array<BootloaderInfo> = require('../dist/bootloader-profiles.json');
const DEVICE_PROFILES: Array<DeviceProfile> = require('../dist/device-profiles.json');

export class FeaturesService {
  private static getDeviceCapabilities(features: any): any {
    var deviceProfile: DeviceProfile = _.find(DEVICE_PROFILES, (profile: any) => {
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

  public setValue(features: IFeatures, skipBootloaderHashCheck?: boolean): void {
    features.deviceCapabilities = FeaturesService.getDeviceCapabilities(features);

    this.addFeatureDataToCoinType(features.coins);

    features.coin_metadata = CoinType.getList().map((coin:CoinType) => coin.toFeatureCoinMetadata());
    features.version = `v${features.major_version}.${features.minor_version}.${features.patch_version}`;

    if (!features.model || features.model === "Unknown") {
      features.model = 'K1-14AM';
    }

    features.available_firmware_version = _.find(FIRMWARE_METADATA_FILE, {modelNumber: features.model}).version;

    let bootloaderHash: string = features.bootloader_mode ? '' : features.bootloader_hash.toHex();
    features.bootloaderInfo = _.find(OFFICIAL_BOOTLOADER_HASHES, {hash: bootloaderHash});
    let isUnofficialBootloader = !features.bootloader_mode && !features.bootloaderInfo && !skipBootloaderHashCheck;
    if (!this._promise || !this.resolver) {
      if (isUnofficialBootloader) {
        this._promise = Promise.reject<Features>(
          `Potential bootloader issue. Please contact support. (${bootloaderHash})`);
      } else if (features.deviceCapabilities) {
        this._promise = Promise.resolve(new Features(features));
      } else {
        this._promise = Promise.reject<Features>('Unknown device or version');
      }
    } else {
      if (isUnofficialBootloader) {
        this.rejector(
          `Potential bootloader issue. Please contact support. (${bootloaderHash})`);
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
