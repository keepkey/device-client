//TODO move this to an @types module

interface ProtoBufModel {
  toArrayBuffer(): ArrayBuffer;
  toBuffer(): Buffer;
  encode(): ByteBuffer;
  toBase64(): string;
  toString(): string;
}

interface MessageHandler {
  messageHandler: (request: ProtoBufModel) => ProtoBufModel | void;
}

interface MessageHandlerClass {
  new (...args: any[]): MessageHandler;
  messageNames: Array<string>;
}
