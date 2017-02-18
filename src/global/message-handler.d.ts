///<reference types="../../dist/messages"/>

import ProtoBufModel = DeviceMessages.ProtoBufModel;

interface ReflectableProtoBufModel extends ProtoBufModel {
  toArrayBuffer(): ArrayBuffer;
  toBuffer(): Buffer;
  encode(): ByteBuffer;
  toBase64(): string;
  toString(): string;
  $type: MessageTypeMetaData;
}

interface MessageTypeMetaData {
  name: string;
}


interface MessageHandler {
  messageHandler: (request: ProtoBufModel) => ProtoBufModel;
}

interface MessageHandlerClass {
  new (...args: any[]): MessageHandler;
  messageNames: Array<string>;
}
