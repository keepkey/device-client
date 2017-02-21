import ByteBuffer = require('bytebuffer');


const OLD_MESSAGE_HEADER_START = '##';
const MESSAGE_HEADER_START = String.fromCharCode(0x3f) + '##';

export abstract class Transport {
  public static MSG_HEADER_LENGTH = 6;

  public deviceInUse: boolean = false;

  private messageMaps = {};
  private messageMap;
  private protoBuf;
  private pendingWriteQueue = Promise.resolve();

  public get deviceId() {
    return this.deviceData.deviceId;
  }

  public get vendorId() {
    return this.deviceData.vendorId;
  }

  public get productId() {
    return this.deviceData.productId;
  }

  protected get hasReportId(): boolean {
    return this.deviceData.maxInputReportSize !== 63;
  }

  protected get reportId() {
    return this.hasReportId ? 0 : 63;
  }

  protected get messageHeaderStart(): string {
    return this.hasReportId ? MESSAGE_HEADER_START : OLD_MESSAGE_HEADER_START;
  }

  constructor(private deviceData) {}

  protected abstract _write(message: ByteBuffer): Promise<any>;
  protected abstract _read(): Promise<any>;

  public setMessageMap(deviceType, proto) {
    var msgClass = '', currentMsgClass = '';

    if (!this.messageMaps.hasOwnProperty(deviceType)) {
      this.messageMaps[deviceType] = {
        msgTypeToClass: {},
        msgClassToType: {}
      };

      // cache message maps
      for (msgClass in proto.MessageType) {
        if (proto.MessageType.hasOwnProperty(msgClass)) {
          currentMsgClass = msgClass.replace('MessageType_', '');
          this.messageMaps[deviceType].msgClassToType[currentMsgClass] =
            proto.MessageType[msgClass];
          this.messageMaps[deviceType].msgTypeToClass[proto.MessageType[msgClass]] =
            currentMsgClass;
        }
      }
    }

    this.messageMap = this.messageMaps[deviceType];
    this.protoBuf = proto;
  }

  public write(txProtoMsg) {
    var msgAB = txProtoMsg.encodeAB();
    const hash = '#'.charCodeAt(0);
    var msgBB = new ByteBuffer(8 + msgAB.byteLength);
    msgBB
      .writeByte(hash)
      .writeByte(hash)
      .writeUint16(this.getMsgType(txProtoMsg.$type.name))
      .writeUint32(msgAB.byteLength)
      .append(msgAB)
      .reset();

    console.log('adding message to the queue');
    return this.pendingWriteQueue
      .then(() => {
        console.log('sending message');
        return this._write(msgBB);
      });


  }

  public read() {
    return this._read()
      .then((rxMsg) => {
        var trimmedBuffer = ByteBuffer.wrap(
          rxMsg.bufferBB.toArrayBuffer().slice(0, rxMsg.header.msgLength));
        return this.parseMsg(rxMsg.header.msgType, trimmedBuffer);
      });
  }

  protected parseMsgHeader(msgBB) {
    // check for header message start
    for (var i = 0,
           iMax = this.messageHeaderStart.length; i < iMax; i += 1) {
      var next = String.fromCharCode(msgBB.readByte());

      if (next !== this.messageHeaderStart[i]) {
        throw {
          name: 'Error',
          message: 'Message header not found'
        };
      }
    }

    // unpack header
    var msgType = msgBB.readUint16();
    var msgLength = msgBB.readUint32();

    // reset msg bytebuffer
    msgBB.reset();

    return {
      msgType: msgType,
      msgLength: msgLength
    };
  }

  private parseMsg(msgType, msgBB) {
    var msgClass = this.getMsgClass(msgType);
    return this.protoBuf[msgClass].decode(msgBB);
  }

  private getMsgType(msgClass) {
    if (!this.messageMap.msgClassToType.hasOwnProperty(msgClass)) {
      throw {
        name: 'Error',
        message: 'Cannot find message name.'
      };
    } else {
      return this.messageMap.msgClassToType[msgClass];
    }
  }

  private getMsgClass(msgType) {
    if (!this.messageMap.msgTypeToClass.hasOwnProperty(msgType)) {
      throw {
        name: 'Error',
        message: 'Cannot find message id.'
      };
    } else {
      return this.messageMap.msgTypeToClass[msgType];
    }
  }
}
