import {BasicClient} from "../device-client";
import ClearSession = DeviceMessages.ClearSession;
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export class EndSessionAction {
  public static operation(client: BasicClient): Promise<any> {
    return client.featuresService.promise
      .then((features: Features) => {
        var message: ClearSession = DeviceMessageHelper.factory('ClearSession');
        return client.writeToDevice(message);
      });
  }
}
