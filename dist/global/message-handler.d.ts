///<reference path="../../dist/messages.d.ts"/>

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

interface MessageHandler<M extends ProtoBufModel, R extends ProtoBufModel | void> {
  messageHandler: (request: M) => R;
}

interface MessageHandlerClass<M extends ProtoBufModel, R extends ProtoBufModel | void> {
  new (...args: any[]): MessageHandler<M, R>;
  messageNames: Array<string>;
}
