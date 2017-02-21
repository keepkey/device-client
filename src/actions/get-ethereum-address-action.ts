import {NodeVector} from "../node-vector";
import {DeviceMessageHelper} from "../device-message-helper";
import EthereumGetAddress = DeviceMessages.EthereumGetAddress;
import EthereumAddress = DeviceMessages.EthereumAddress;
import {ActionHelper} from "./action-helper";

export class GetEthereumAddressAction {
  public static operation(client,
                          addressN: NodeVector,
                          showDisplay: boolean): Promise<EthereumAddress> {

    var message: EthereumGetAddress = DeviceMessageHelper.factory('EthereumGetAddress');
    message.setAddressN(addressN.toArray());
    message.setShowDisplay(showDisplay);

    return client.writeToDevice(message)
      .catch(ActionHelper.ignoreCancelledAction);
  }
}
