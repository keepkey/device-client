/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import CharacterAck = DeviceMessages.CharacterAck;
import {DeviceMessageHelper} from "../device-message-helper";
import {Features} from "../global/features";

interface CharacterAckOptions {
  character?: string;
  delete?: boolean;
  done?: boolean;
}

export class CharacterAckAction {
  private static DEFAULT_OPTIONS: CharacterAckOptions = {
    character: '',
    delete: false,
    done: false
  };

  public static operation(client, options: CharacterAckOptions) {
    var o: CharacterAckOptions = _.extend(
      {}, CharacterAckAction.DEFAULT_OPTIONS, options);

    return client.featuresService.promise
      .then((features: Features) => {
        var message: CharacterAck = DeviceMessageHelper.factory('CharacterAck');
        message.setCharacter(o.character);
        message.setDelete(o.delete);
        message.setDone(o.done);

        return client.writeToDevice(message);
      });
  }
}
