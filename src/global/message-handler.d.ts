///<reference path="../../dist/messages.d.ts"/>

import ProtoBufModel = DeviceMessages.ProtoBufModel;
import * as ByteBuffer from "bytebuffer";

export interface ReflectableProtoBufModel extends ProtoBufModel {
  toArrayBuffer(): ArrayBuffer;
  toBuffer(): Buffer;
  encode(): ByteBuffer;
  toBase64(): string;
  toString(): string;
  $type: MessageTypeMetaData;
}

export interface MessageTypeMetaData {
  name: string;
}

export interface MessageHandler<M extends ProtoBufModel, R extends ProtoBufModel | void> {
  messageHandler: (request: M) => R;
}

export interface MessageHandlerClass<M extends ProtoBufModel, R extends ProtoBufModel | void> {
  new (...args: any[]): MessageHandler<M, R>;
  messageNames: Array<string>;
}
