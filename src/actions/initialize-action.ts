import {BasicClient} from "../device-client";
import Initialize = DeviceMessages.Initialize;
import {DeviceMessageHelper} from "../device-message-helper";
import {IFeatures} from "../global/features";

export class InitializeAction {
  public static operation(client: BasicClient, skipBootloaderHashCheck?: boolean): Promise<any> {
    var message: Initialize = DeviceMessageHelper.factory('Initialize');

    return client.writeToDevice(message)
      .then((featuresMessage: IFeatures) => {
        client.featuresService.setValue(featuresMessage, skipBootloaderHashCheck);
        return client.featuresService.promise;
      });
  }
}
