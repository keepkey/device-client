/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

/* tslint:disable:no-bitwise */
import * as _ from 'lodash';
import ByteBuffer = require('bytebuffer');

import {ExtendedPurposeCodeHelper} from "./purpose-code-helper";

const HARDENED_NODE_FLAG = 0x80000000;
const EXTENDED_PURPOSE_FLAG = 0x40000000;

export class NodeVector {
  private _value: Array<number>;

  constructor(args: Array<number>) {
    this._value = _.clone(args);
  }

  public static fromString(addressN: NodeVector | string): NodeVector {
    if (!addressN) {
      return null;
    }
    if (addressN instanceof NodeVector) {
      return addressN;
    }
    var nodeVectorStrings = (<string>addressN).toUpperCase().split('/');

    if (nodeVectorStrings[0] === 'M') {
      nodeVectorStrings = nodeVectorStrings.slice(1);
    }
    var result: number[] = [];

    _.transform(nodeVectorStrings, NodeVector.convertNodeStringToNumber, result);

    return new NodeVector(result);
  }

  public static fromBuffer(buffer: ByteBuffer): NodeVector {
    var vectorArray = [];
    buffer.BE();

    var length = buffer.readUint8();
    for (var i = 0; i < length; i++) {
      vectorArray.push(buffer.readUint32());
    }

    return new NodeVector(vectorArray);
  }

  public static join(vectors: Array<NodeVector | string>) {
    return _.reduce(
      vectors,
      (result, vector) => result.join(NodeVector.fromString(vector)),
      new NodeVector([])
    );
  }

  private static convertNodeStringToNumber(result: number[], nodeString: string) {
    if (nodeString.substring(nodeString.length - 1) === "'") {
      nodeString = '-' + nodeString.substring(0, nodeString.length - 1);
    }

    var value = parseInt(nodeString, 10);
    if (isNaN(value)) {
      value = ExtendedPurposeCodeHelper.encode(nodeString);
    } else if (value < 0) {
      value = (Math.abs(value) | HARDENED_NODE_FLAG) >>> 0;
    }

    if (nodeString === '-0') {
      result.push(HARDENED_NODE_FLAG);
    } else {
      result.push(value);
    }

    return result;
  };

  public join(o: NodeVector | string): NodeVector {
    if (o) {
      let vector = NodeVector.fromString(o);
      return new NodeVector(this._value.concat(vector.toArray()));
    } else {
      return new NodeVector(this._value);
    }
  }

  public toString(): string {
    var converted = ['m'];
    this._value.forEach((it: number) => {
      if (it & HARDENED_NODE_FLAG) {
        if (it & EXTENDED_PURPOSE_FLAG) {
          converted.push(ExtendedPurposeCodeHelper.decode(it));
        } else {
          converted.push((it ^ HARDENED_NODE_FLAG) + '\'');
        }
      } else {
        converted.push(it.toString());
      }
    });
    return converted.join('/');
  }

  public toArray(): Array<number> {
    return this._value;
  }

  public toBuffer(): ByteBuffer {
    var nodeVectorDepth = this._value.length;
    var buffer = ByteBuffer.allocate(nodeVectorDepth * 4 + 1).BE();
    buffer.writeUint8(nodeVectorDepth);
    this._value.forEach(function (node) {
      buffer.writeUint32(node);
    });
    buffer.reset();
    return buffer;
  }
}
