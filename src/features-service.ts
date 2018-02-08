import * as _ from "lodash";
import {Features, IFeatureCoin, IFeatures} from "./global/features";
import {CoinType} from "./global/coin-type";

export class FeaturesService {
  private static firmwareFileMetaData: FirmwareFileMetadata = require('../dist/keepkey_main.json');
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
    features.available_firmware_version = FeaturesService.firmwareFileMetaData.version;
    features.deviceCapabilities = FeaturesService.getDeviceCapabilities(features);

    this.addFeatureDataToCoinType(features.coins);

    //TODO There should be on canonical coin list that comes from the device
    features.coin_metadata = CoinType.getList().map((coin:CoinType) => coin.toFeatureCoinMetadata());

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
