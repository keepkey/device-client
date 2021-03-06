import {BasicClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import ApplySettings = DeviceMessages.ApplySettings;
import {Language} from "../global/language";
import {Features} from "../global/features";
import {ActionHelper} from "./action-helper";

export class ApplySettingsAction {
  public static operation(client: BasicClient, usePassphrase: boolean,
                          language: Language, label: string, autoLockDelayMs: number) {
    return client.featuresService.promise
      .then((features: Features) => {
        if (!features.initialized) {
          return Promise.reject('Device not initialized');
        }
      })
      .then((features) => {
        var message: ApplySettings = DeviceMessageHelper.factory('ApplySettings');
        if (label !== null) {
          message.setLabel(label);
        }
        if (language !== null) {
          message.setLanguage(Language[language]);
        }
        if (usePassphrase !== null) {
          message.setUsePassphrase(usePassphrase);
        }
        if (autoLockDelayMs !== null) {
          message.setAutoLockDelayMs(autoLockDelayMs);
        }

        return client.writeToDevice(message);
      })
      .catch(ActionHelper.ignoreCancelledAction);
  }
}
