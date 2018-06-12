import { Transport } from './transport';
const { DeviceClientManager } = require('./device-client-manager');
const ByteBuffer = require('bytebuffer');

const SEGMENT_SIZE = 63;
const REPORT_ID = 63;

// change this
declare const Promise: any;

export class NodeTransport extends Transport {
  public hid;
  private readInProgress: boolean;

  constructor(hid) {
    const deviceId = hid.getDeviceInfo().serialNumber;
    super({
      vendorId: 11044,
      deviceId,
      productId: 1
    });
    this.hid = hid;
  }

  public static factory(hid) {
    return DeviceClientManager.instance.factory(new NodeTransport(hid));
  }

  getFillerBuffer(fillerLength) {
    return ByteBuffer.wrap(new Array(fillerLength + 1).join('\0'));
  }

  private readFromHid(rxMsg?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.hid.read((err, rxMsgAB) => {
        if (typeof rxMsg === 'undefined') {
          // first packet of the message
          rxMsg = rxMsg || {
            header: null,
            bufferBB: ByteBuffer.wrap(rxMsgAB)
          };
        } else {
          // additional packets
          rxMsg.bufferBB = ByteBuffer.concat([rxMsg.bufferBB,
          ByteBuffer.wrap(rxMsgAB.slice(this.hasReportId ? 1 : 0))]);
        }
        resolve(rxMsg);
      });
    });
  }

  private writeToHid(txSegmentBB) {
    return new Promise((resolve, reject) => {
      try {
        const arr = new Uint8Array(txSegmentBB.toArrayBuffer())
          .reduce((acum, b) => {
          acum.push(b);
          return acum;
        }, []);

        this.hid.write(arr);
      } catch (error) {
        console.log('Error sending to HID:', error);
        reject(error);
      }
    });
  }

  protected _write(txMsgBB) {
    const packetFragmentHeader = new Uint8Array(1);
    packetFragmentHeader[0] = 63;
    var i = 0,
      max = txMsgBB.limit,
      txSegmentAB = null,
      txSegmentBB = null,
      writePromise = Promise.resolve();

    // break frame into segments
    for (; i < max; i += SEGMENT_SIZE) {
      txSegmentAB = txMsgBB.toArrayBuffer().slice(i, i + SEGMENT_SIZE);

      var packetFragments = [];
      if (this.hasReportId) {
        packetFragments.push(packetFragmentHeader);
      }
      packetFragments.push(txSegmentAB);
      packetFragments.push(this.getFillerBuffer(SEGMENT_SIZE - txSegmentAB.byteLength));

      txSegmentBB = ByteBuffer.concat(packetFragments);

      writePromise
        .then(this.writeToHid.bind(this, txSegmentBB))
        .catch(err => console.log('new err: ', err));

    }
    return writePromise;
  }

  protected _read() {
    if (this.readInProgress) {
      return Promise.reject('read is not re-entrant');
    }
    this.readInProgress = true;
    return this.readFromHid()
      .then((rxMsg) => {  // first segment
        // parse header and then remove it from buffer
        rxMsg.header = this.parseMsgHeader(rxMsg.bufferBB);
        rxMsg.bufferBB =
          ByteBuffer.wrap(rxMsg.bufferBB
            .toArrayBuffer()
            .slice(this.messageHeaderStart.length + Transport.MSG_HEADER_LENGTH));

        // if message length is longer than what we have buffered, create promises
        // for each remaining segment
        if (rxMsg.header.msgLength > rxMsg.bufferBB.limit) {
          var remainingCount = Math.ceil((rxMsg.header.msgLength - rxMsg.bufferBB.limit) / SEGMENT_SIZE);
          var readSegments = Promise.resolve(rxMsg);

          for (var i = 0, max = remainingCount; i < max; i += 1) {
            readSegments = readSegments.then(this.readFromHid.bind(this));
          }

          return readSegments.then((segmentRxMsg) => {
            this.readInProgress = false;
            return segmentRxMsg;
          });
        } else {
          this.readInProgress = false;
          return rxMsg;      // no more segments so just return this one segment
        }
    });
  };
};


