/**
 * @license
 * Copyright 2017 KeepKey, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as _ from 'lodash';
import {DeviceClient, FirmwareStreamFactory} from "./device-client";
import {Transport} from "./transport";
import {DeviceMessageHelper} from "./device-message-helper";
import {EventEmitter} from "events";
import {HidHelper} from "./hid-helper";

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

export class DeviceClientManager extends EventEmitter {
  public static DEVICE_CONNECTED_EVENT = 'connected';
  private static _instance: DeviceClientManager;

  public static get instance(): DeviceClientManager {
    if (!DeviceClientManager._instance) {
      DeviceClientManager._instance = new DeviceClientManager();
    }
    return DeviceClientManager._instance;
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

  private _rawFirmwareStreamFactory: FirmwareStreamFactory;
  public get rawFirmwareStreamFactory(): FirmwareStreamFactory {
    return this._rawFirmwareStreamFactory;
  }

  public set rawFirmwareStreamFactory(streamFactory: FirmwareStreamFactory) {
    this._rawFirmwareStreamFactory = streamFactory;
  }

  public clients: _.Dictionary<DeviceClient> = {};

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

    this.emit(DeviceClientManager.DEVICE_CONNECTED_EVENT, client);

    return client;
  }
}

