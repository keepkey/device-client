import {BasicClient} from "../device-client";
import Initialize = DeviceMessages.Initialize;
import {DeviceMessageHelper} from "../device-message-helper";
import {IFeatures} from "../global/features";

export class InitializeAction {
  public static operation(client: BasicClient, skipBootloaderHashCheck?: boolean): Promise<any> {
    var initialize: Initialize = DeviceMessageHelper.factory('Initialize');

    return client.writeToDevice(initialize)
    .then((features: IFeatures) => {
      return client.featuresService.setValue(features, client, !!skipBootloaderHashCheck);
    });
  }
}
