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

    if (deviceProfile.capabilities.supportsRecoveryDryRun === undefined)
        deviceProfile.capabilities.supportsRecoveryDryRun = false;

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
        for (let i = 0; i < Math.min(100, head.num_coins); i += head.chunk_size) {
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

    let availableVersions = []
    for (var i = 0; i < FIRMWARE_METADATA_FILE.length; i++) {
        if (FIRMWARE_METADATA_FILE[i].isBootloaderUpdater === false) {
            availableVersions.push(FIRMWARE_METADATA_FILE[i].version);
        }
    }
    features.available_firmware_versions = availableVersions;

    let bootloaderHash: string = features.bootloader_mode ? '' : features.bootloader_hash.toHex();
    features.bootloaderInfo = _.find(OFFICIAL_BOOTLOADER_HASHES, {hash: bootloaderHash});

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
