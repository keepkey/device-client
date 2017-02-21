import {BasicClient} from "../device-client";
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export class CancelAction {
  public static operation(client: BasicClient) {
    return client.featuresService.promise
      .then((features: Features) => {
        var message = DeviceMessageHelper.factory('Cancel');
        return client.writeToDevice(message);
      });
  }
}
