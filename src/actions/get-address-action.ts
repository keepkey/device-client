/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import {NodeVector} from "../node-vector";
import {DeviceMessageHelper} from "../device-message-helper";
import GetAddress = DeviceMessages.GetAddress;
import MultisigRedeemScriptType = DeviceMessages.MultisigRedeemScriptType;
import {ActionHelper} from "./action-helper";

export class GetAddressAction {
  public static operation(client,
                          addressN: NodeVector,
                          coinName: string,
                          showDisplay: boolean,
                          multisig: MultisigRedeemScriptType): Promise<any> {

    var message: GetAddress = DeviceMessageHelper.factory('GetAddress');
    message.setAddressN(addressN.toArray());
    message.setCoinName(coinName);
    message.setShowDisplay(showDisplay);
    if (multisig) {
      message.setMultisig(multisig);
    }

    return client.writeToDevice(message)
      .catch(ActionHelper.ignoreCancelledAction);

  }
}
