import * as _ from 'lodash';
import ByteBuffer = require('bytebuffer');
import Long = require('long');

export class DeviceMessageHelper {
  public static messageFactories = require('../dist/messages.js');

  public static factory(MessageType, ...args) {
    return new (Function.prototype.bind.apply(DeviceMessageHelper.messageFactories[MessageType], args));
  }

  public static decode<T>(messageType: string, message: ByteBuffer): T {
    return DeviceMessageHelper.messageFactories[messageType].decode(message);
  }

  public static hydrate(pbMessage: ReflectableProtoBufModel) {
    var objReflection: any = pbMessage.$type;
    var newMessage = _.cloneDeepWith<any>(pbMessage, (value) => {
      if (ByteBuffer.isByteBuffer(value)) {
        return value;
      }
    });

    var enumFields = _.filter(objReflection._fields, (it : any) => {
      return it.resolvedType && it.resolvedType.className === 'Enum';
    });

    _.each(enumFields, function (it: any) {
      var value = pbMessage[it.name];
      var match: any = _.find(it.resolvedType.children, {id: value});
      newMessage[it.name] = match.name;
    });

    newMessage.typeName = pbMessage.$type.name;
    return newMessage;
  }

  public static toPrintable(pbMessage) {
    return JSON.stringify(
      DeviceMessageHelper.hydrate(pbMessage),
      DeviceMessageHelper.buffer2Hex,
      4
    );
  }

  public static buffer2Hex(key, value: any) {
    if (key === 'passphrase' || key === 'pin') {
      return '<redacted>';
    } else if (value && value.buffer) {
      // NOTE: v.buffer is type Buffer in node and ArrayBuffer in chrome
      if (value.buffer instanceof Buffer) {
        return value.toHex();
      }

      var hexstring = '';
      if (value.limit > 1000) {
        return '<long buffer suppressed>';
      }
      for (var i = value.offset; i < value.limit; i++) {
        if (value.view[i] < 16) {
          hexstring += 0;
        }
        hexstring += value.view[i].toString(16);
      }
      return hexstring;
    } else if (value && !_.isUndefined(value.low) && !_.isUndefined(value.high) && !_.isUndefined(value.unsigned)) {
      return (new Long(value.low, value.high, value.unsigned)).toString();
    } else {
      return value;
    }
  }

  public static getSelectedResponse(signedResponse: DeviceMessages.SignedExchangeResponse): DeviceMessages.ExchangeResponse | DeviceMessages.ExchangeResponseV2 {
    let responseV1 = signedResponse.getResponse();
    let responseV2 = signedResponse.getResponseV2();

    if (responseV1 && responseV2) {
      throw 'Invalid signed response. Both V1 and V2 responses returned';
    } else if (!responseV1 && !responseV2) {
      throw 'Invalid signed response. No response returned';
    }
    return responseV1 || responseV2;
  }
}
