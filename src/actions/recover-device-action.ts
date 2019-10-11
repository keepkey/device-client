import * as _ from 'lodash';

import {BasicClient} from "../device-client";
import RecoveryDevice = DeviceMessages.RecoveryDevice;
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export interface RecoverDeviceOptions {
  passphrase_protection?: boolean;
  pin_protection?: boolean;
  language?: string;
  label?: string;
  word_count?: number;
  enforce_wordlist?: boolean;
  use_character_cipher?: boolean;
  dry_run?: boolean;
}

enum FailureCodes {
  'Failure_ActionCancelled'
}

export class RecoverDeviceAction {
  private static DEFAULT_OPTIONS: RecoverDeviceOptions = {
    passphrase_protection: false,
    pin_protection: true,
    language: null,
    label: null,
    word_count: 12,
    enforce_wordlist: true,
    use_character_cipher: true,
    dry_run: false
  };

  public static operation(client: BasicClient, options: RecoverDeviceOptions) {
    var o: RecoverDeviceOptions = _.extend(
      {}, RecoverDeviceAction.DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then((features: Features) => {
        if (features.initialized && !o.dry_run) {
          return Promise.reject("Expected the device to be uninitialized");
        }

        if (!features.initialized && o.dry_run) {
          return Promise.reject("Expected the device to be initialized");
        }

        o.use_character_cipher = features.supportsCipheredKeyRecovery;
        if (o.use_character_cipher) {
          o.word_count = 0;
        } else {
          o.word_count = features.defaultMnemonicSeedLength;
        }

        var message: RecoveryDevice = DeviceMessageHelper.factory('RecoveryDevice');
        message.setWordCount(o.word_count);
        message.setPassphraseProtection(o.passphrase_protection);
        message.setPinProtection(o.pin_protection);
        message.setLanguage(o.language);
        message.setLabel(o.label);
        message.setEnforceWordlist(o.enforce_wordlist);
        message.setUseCharacterCipher(o.use_character_cipher);
        message.setDryRun(o.dry_run);
        message.setU2fCounter(Math.floor(Date.now() / 1000))

        return client.writeToDevice(message)
          .catch((failureMessage) => {
            if (!FailureCodes[failureMessage.code]) {
              return Promise.reject(failureMessage);
            }
          });
      })
      .catch(function (failure) {
        console.log('deviceRecovery failed', arguments);
        return Promise.reject(failure);
      });

  }
}
