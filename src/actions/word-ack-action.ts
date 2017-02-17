/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {BasicClient} from "../device-client";
import WordAck = DeviceMessages.WordAck;
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

export interface WordAckOptions {
  word?: string;
}

export class WordAckAction {
  private static DEFAULT_OPTIONS: WordAckOptions = {
    word: ''
  };

  public static operation(client: BasicClient, options: WordAckOptions) {
    var o: WordAckOptions = _.extend(
      {}, WordAckAction.DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then((features: Features) => {
        var message: WordAck = DeviceMessageHelper.factory('WordAck');
        message.setWord(o.word);

        return client.writeToDevice(message);
      });
  }
}

