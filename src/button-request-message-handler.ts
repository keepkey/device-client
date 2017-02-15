/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import {DeviceMessageHelper} from "./device-message-helper";
import ButtonRequest = DeviceMessages.ButtonRequest;
import ButtonAck = DeviceMessages.ButtonAck;

export class ButtonRequestMessageHandler implements MessageHandler {
  public static messageNames = ['ButtonRequest'];

  public messageHandler(request: ButtonRequest): ButtonAck {
    return DeviceMessageHelper.factory('ButtonAck');
  }
}
