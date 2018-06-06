import * as _ from "lodash";
import {Features, IFeatureCoin, IFeatures} from "./global/features";
import {CoinType} from "./global/coin-type";

const FIRMWARE_METADATA_FILE: Array<FirmwareFileMetadata> = require('../dist/firmware.json');
const OFFICIAL_BOOTLOADER_HASHES = [
  '6397c446f6b9002a8b150bf4b9b4e0bb66800ed099b881ca49700139b0559f10', // v1.0.0
  'f13ce228c0bb2bdbc56bdcb5f4569367f8e3011074ccc63331348deb498f2d8f', // v1.0.0-patched
  'd544b5e06b0c355d68b868ac7580e9bab2d224a1e2440881cc1bca2b816752d5', // v1.0.1
  'ec618836f86423dbd3114c37d6e3e4ffdfb87d9e4c6199cf3e163a67b27498a2', // v1.0.1-patched
  'cd702b91028a2cfa55af43d3407ba0f6f752a4a2be0583a172983b303ab1032e', // v1.0.2
  'bcafb38cd0fbd6e2bdbea89fb90235559fdda360765b74e4a8758b4eff2d4921', // v1.0.2-patched
  '2e38950143cf350345a6ddada4c0c4f21eb2ed337309f39c5dbc70b6c091ae00', // v1.0.3v3
  '83d14cb6c7c48af2a83bc326353ee6b9abdd74cfe47ba567de1cb564da65e8e9', // v1.0.3v3-patched
  'cb222548a39ff6cbe2ae2f02c8d431c9ae0df850f814444911f521b95ab02f4c', // v1.0.3
  '917d1952260c9b89f3a96bea07eea4074afdcc0e8cdd5d064e36868bdd68ba7d', // v1.0.3-patched
  '6465bc505586700a8111c4bf7db6f40af73e720f9e488d20db56135e5a690c4f', // v1.0.3v2
  'db4bc389335e876e942ae3b12558cecd202b745903e79b34dd2c32532708860e', // v1.0.3v2-patched
  '2e38950143cf350345a6ddada4c0c4f21eb2ed337309f39c5dbc70b6c091ae00', // v1.0.3v3
  '83d14cb6c7c48af2a83bc326353ee6b9abdd74cfe47ba567de1cb564da65e8e9', // v1.0.3v3-patched
  '770b30aaa0be884ee8621859f5d055437f894a5c9c7ca22635e7024e059857b7', // v1.0.4
  'fc4e5c4dc2e5127b6814a3f69424c936f1dc241d1daf2c5a2d8f0728eb69d20d', // v1.0.4-patched
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

    features.coin_metadata = CoinType.getList().map((coin:CoinType) => coin.toFeatureCoinMetadata());
    features.version = `v${features.major_version}.${features.minor_version}.${features.patch_version}`;

    if (!features.model) {
      features.model = 'K1-14AM';
    }

    features.available_firmware_version = _.find(FIRMWARE_METADATA_FILE, {modelNumber: features.model}).version;

    let bootloaderHash: string = features.bootloader_mode ? '' : features.bootloader_hash.toHex();
    let isUnofficialBootloader = !features.bootloader_mode && !_.includes(OFFICIAL_BOOTLOADER_HASHES, bootloaderHash);
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
