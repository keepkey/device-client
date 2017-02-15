/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

import * as _ from 'lodash';

import {DeviceClient} from "./device-client";
import {Transport} from "./transport";
import {DeviceMessageHelper} from "./device-message-helper";
import {EventEmitter} from "events";
import Dictionary = _.Dictionary;
import {HidHelper} from "./hid-helper";
import {Readable} from "stream";

const RECOGNIZED_DEVICES: Array<any> = [
  {
    type: "KEEPKEY",
    vendorId: 11044,
    productId: 1
  },
  {
    type: "TREZOR",
    vendorId: 21324,
    productId: 1
  }
];

export class DeviceClientPool extends EventEmitter {
  public static DEVICE_CONNECTED_EVENT = 'connected';
  private static _instance: DeviceClientPool;

  public static get instance(): DeviceClientPool {
    if (!DeviceClientPool._instance) {
      DeviceClientPool._instance = new DeviceClientPool();
    }
    return DeviceClientPool._instance;
  }


  private _hidHelper: HidHelper;

  public get hidHelper(): HidHelper {
    if (!this._hidHelper) {
      throw 'HidHelper must be set';
    }
    return this._hidHelper;
  }

  public set hidHelper(helper: HidHelper) {
    if (this._hidHelper) {
      throw "HidHelper is already set";
    }
    this._hidHelper = helper;
  }

  private _rawFirmwareStreamFactory: () => Readable;
  public get rawFirmwareStreamFactory(): () => Readable {
    if (!this._rawFirmwareStreamFactory) {
      throw 'rawFirmwareStream must be set';
    }
    return this._rawFirmwareStreamFactory;
  }

  public set rawFirmwareStreamFactory(streamFactory: () => Readable) {
    this._rawFirmwareStreamFactory = streamFactory;
  }

  private clients: Dictionary<DeviceClient> = {};

  public findByDeviceId(deviceId): DeviceClient {
    return this.clients[deviceId];
  }

  public remove(deviceId): void {
    if (this.clients[deviceId]) {
      this.clients[deviceId].destroy();
      delete this.clients[deviceId];
    }
  }

  public getActiveClient(): Promise<DeviceClient> {
    return this.hidHelper.getActiveClient();
  }

  public factory(transport: Transport): DeviceClient {
    var deviceType = _.find(RECOGNIZED_DEVICES, {
      vendorId: transport.vendorId,
      productId: transport.productId
    });
    if (deviceType) {
      transport.setMessageMap(deviceType, DeviceMessageHelper.messageFactories);
      return this.findByDeviceId(transport.deviceId) ||
        this.createNewDeviceClient(transport);
    } else {
      throw 'unrecognized device: ' + transport;
    }
  }

  private createNewDeviceClient(transport): DeviceClient {
    var client = new DeviceClient(transport, this.rawFirmwareStreamFactory);
    this.clients[client.transport.deviceId] = client;

    this.emit(DeviceClientPool.DEVICE_CONNECTED_EVENT, client);

    return client;
  }
}

