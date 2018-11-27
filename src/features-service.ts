import * as _ from "lodash";
import {BootloaderInfo, DeviceProfile, Features, IFeatureCoin, IFeatures, ICoinTable} from "./global/features";
import {CoinType} from "./global/coin-type";
import {BasicClient} from "./device-client";
import {DeviceMessageHelper} from "./device-message-helper";
import GetCoinTable = DeviceMessages.GetCoinTable;

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

  public async setValue(features: IFeatures, client: BasicClient,
                        skipBootloaderHashCheck?: boolean): Promise<Features> {
    features.deviceCapabilities = FeaturesService.getDeviceCapabilities(features);

    if (!features.bootloader_mode) {
      // Legacy support for devices that still put the CoinTable in the
      // Features object.
      features.coins = features.coins || [];

      if (features.deviceCapabilities.hasPagedCoinTable ||
          features.major_version > 5 ||
          (features.major_version == 5 && features.minor_version >= 7)) {
        // Grab all of the pages of the coin table.
        //
        // To start, we have to find out how many coins the device supports,
        // and what chunk size it is prepared to return them back in.
        let head_message: GetCoinTable = DeviceMessageHelper.factory('GetCoinTable');
        let head = await client.writeToDevice(head_message);

        // Then iterate through and request each of the chunks, building up
        // a chain of promises of the features object.
        for (let i = 0; i < Math.min(72, head.num_coins); i += head.chunk_size) {
          let tail_message: GetCoinTable = DeviceMessageHelper.factory('GetCoinTable');
          tail_message.setStart(i);
          tail_message.setEnd(Math.min(i + head.chunk_size, head.num_coins));
          let tail: ICoinTable = await client.writeToDevice(tail_message);
          // And add those chunks to the coin table. We do this to minimize the
          // impact on users of device-client, and keep some semblance of API
          // stability, despite having paginated the coins table.
          features.coins = features.coins.concat(tail.table);
        }
      }

      features.coins.forEach((coin) => {
        CoinType.fromFeatureCoin(coin);
      });

      let coin_list = CoinType.getList();
      features.coin_metadata = coin_list.map((coin:CoinType) => coin.toFeatureCoinMetadata());
    }

    features.version = `v${features.major_version}.${features.minor_version}.${features.patch_version}`;

    if (!features.model || features.model === "Unknown") {
      features.model = 'K1-14AM';
    }

    let bootloaderHash: string;
    if (skipBootloaderHashCheck) {
        features.available_firmware_version = features.version;

        bootloaderHash = "unofficial bootloader";
        features.bootloaderInfo = undefined;
    } else {
        let firmwareVersion: FirmwareFileMetadata = _.find(FIRMWARE_METADATA_FILE, <object>{modelNumber: features.model});
        if (!firmwareVersion) {
            firmwareVersion = _.find(FIRMWARE_METADATA_FILE, <object>{modelNumber: "K1-14AM"});
        }
        features.available_firmware_version = firmwareVersion.version;

        bootloaderHash = features.bootloader_mode ? '' : features.bootloader_hash.toHex();
        features.bootloaderInfo = _.find(OFFICIAL_BOOTLOADER_HASHES, {hash: bootloaderHash});
    }

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

    return this.promise;
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
