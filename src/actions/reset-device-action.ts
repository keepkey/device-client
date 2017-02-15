/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {BasicClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import ResetDevice = DeviceMessages.ResetDevice;
import {Features} from "../global/features";

export interface ResetDeviceOptions {
  display_random?: boolean;
  strength?: number;
  passphrase_protection?: boolean;
  pin_protection?: boolean;
  language?: string;
  label?: string;
}

export class ResetDeviceAction {
  private static DEFAULT_OPTIONS: ResetDeviceOptions = {
    display_random: false,
    passphrase_protection: false,
    pin_protection: true,
    language: 'english',
    label: null
  };

  public static operation(client: BasicClient, options: ResetDeviceOptions) {
    return client.featuresService.promise
      .then((features: Features) => {

        if (!features.initialized) {
          var o: ResetDeviceOptions =
            _.extend({}, ResetDeviceAction.DEFAULT_OPTIONS, options);

          var message: ResetDevice = DeviceMessageHelper.factory('ResetDevice');
          message.setDisplayRandom(o.display_random);
          message.setStrength(o.strength ||
            ResetDeviceAction.wordCount2KeyStrength(
              features.defaultMnemonicSeedLength) || 128);
          message.setPassphraseProtection(o.passphrase_protection);
          message.setPinProtection(o.pin_protection);
          message.setLanguage(o.language);
          message.setLabel(o.label);

          return client.writeToDevice(message);
        } else {
          return Promise.reject('Expected device to be uninitialized. Run WipeDevice and try again.');
        }

      });
  }

  private static wordCount2KeyStrength(wc: number): number {
    switch (wc) {
      case 12: return 128;
      case 18: return 192;
      case 24: return 256;
      default: return 0;
    }
  }
}
