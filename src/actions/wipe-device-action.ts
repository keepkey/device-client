import {BasicClient} from "../device-client";
import WipeDevice = DeviceMessages.WipeDevice;
import {DeviceMessageHelper} from "../device-message-helper";

export class WipeDeviceAction {
  public static operation(client: BasicClient): Promise<any> {
    var message: WipeDevice = DeviceMessageHelper.factory('WipeDevice');
    return client.writeToDevice(message)
      .then((response) => {
        client.featuresService.clear();
      });
  }
}
