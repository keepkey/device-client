/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {MessageSender} from "./message-states";
import {MessageState} from "./message-states";
import {MessageStates} from "./message-states";
import {MessageName} from "./message-states";
import {MessageDirection} from "./message-states";

export class DeviceMessageStates {
  public static Cancel: MessageName = 'Cancel';
  public static TxRequest: MessageName = 'TxRequest';
  public static EthereumTxRequest: MessageName = 'EthereumTxRequest';

  public static isInterstitialMessage(lastMessage: MessageState, message: MessageName) {
    return lastMessage.interstitialMessages &&
      (_.indexOf(lastMessage.interstitialMessages, message) !== -1);
  }

  /***
   * return the message state information for a request from the host
   * @type {any}
   */
  public static getHostMessageState(name: MessageName): MessageState {
    return MessageStates.getMessageState(MessageSender.host, MessageDirection.request, name);
  }

  /***
   * return the message state information for request from the device
   * @type {any}
   */
  public static getDeviceMessageState(name: MessageName): MessageState {
      return MessageStates.getMessageState(MessageSender.device, MessageDirection.request, name);
  }
}
