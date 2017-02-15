/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */
import * as  _ from 'lodash';

import Timer = NodeJS.Timer;
import {WordAckAction} from "./actions/word-ack-action";
import {CharacterAckAction} from "./actions/character-ack-action";
import {InitializeAction} from "./actions/initialize-action";
import {CancelAction} from "./actions/cancel-action";
import {WipeDeviceAction} from "./actions/wipe-device-action";
import {ResetDeviceAction} from "./actions/reset-device-action";
import {RecoverDeviceAction} from "./actions/recover-device-action";
import {PinMatrixAckAction} from "./actions/pin-matrix-ack-action";
import {FirmwareUploadAction} from "./actions/firmware-upload-action";
import {GetAddressAction} from "./actions/get-address-action";
import {GetPublicKeyAction} from "./actions/get-public-key-action";
import {SignMessageAction} from "./actions/sign-message-action";
import {EncryptMessageAction} from "./actions/encrypt-message-action";
import {EndSessionAction} from "./actions/end-session-action";
import {ChangePinAction} from "./actions/change-pin-action";
import {ApplySettingsAction} from "./actions/apply-settings-action";
import {DeviceMessageHelper} from "./device-message-helper";
import {StatefulDeviceMessenger} from "./stateful-device-messenger";
import {EntropyRequestMessageHandler} from "./entropy-request-message-handler";
import {ButtonRequestMessageHandler} from "./button-request-message-handler";
import {CipherNodeVectorAction} from "./actions/cipher-node-vector-action";
import {CipherAccountNameAction} from "./actions/cipher-account-name-action";
import {PassphraseAckAction} from "./actions/passphrase-ack-action";
import {Transport} from "./transport";
import {ApplyPolicyAction} from "./actions/apply-policy-action";
import * as DeviceClientMethods from "./device-client-methods";
import {GetEthereumAddressAction} from "./actions/get-ethereum-address-action";
import {FeaturesService} from "./features-service";
import {EventEmitter} from "events";
import {Readable} from "stream";

export const KEEPKEY = 'KEEPKEY';

export interface BasicClient {
  featuresService: FeaturesService;
  writeToDevice: (message) => Promise<any>;
}

export class DeviceClient extends EventEmitter implements BasicClient {
  public static UNEXPECTED_MESSAGE_EVENT = StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT;

  /* imported methods */
  public initialize = _.partial(InitializeAction.operation, this);
  public cancel = _.partial(CancelAction.operation, this);
  public wipeDevice = _.partial(WipeDeviceAction.operation, this);
  public resetDevice = <DeviceClientMethods.ResetDeviceFunction>
    _.partial(ResetDeviceAction.operation, this, _);
  public recoveryDevice = <DeviceClientMethods.RecoveryDeviceFunction>
    _.partial(RecoverDeviceAction.operation, this, _);
  public pinMatrixAck = _.partial(PinMatrixAckAction.operation, this, _);
  public wordAck = _.partial(WordAckAction.operation, this, _);
  public characterAck = _.partial(CharacterAckAction.operation, this, _);
  public firmwareUpload = <DeviceClientMethods.FirmwareUploadFunction>
    _.partial(FirmwareUploadAction.operation, this);
  public getAddress = <DeviceClientMethods.GetAddressFunction>
    _.partial(GetAddressAction.operation, this, _, _, true, null);
  public getEthereumAddress = <DeviceClientMethods.GetEthereumAddressFunction>
    _.partial(GetEthereumAddressAction.operation, this, _, _);
  public getPublicKey = <DeviceClientMethods.GetPublicKeyFunction>
    (_.partial(GetPublicKeyAction.operation, this, _, _));
  public signMessage = _.partial(SignMessageAction.operation, this, _);
  public encryptMessage = _.partial(EncryptMessageAction.operation, this, _);
  public endSession = _.partial(EndSessionAction.operation, this);
  public changePin = _.partial(ChangePinAction.operation, this, _);
  public changeLabel = <DeviceClientMethods.ChangeLabelFunction>
    _.partial(ApplySettingsAction.operation, this, null, null, _);
  public enablePassphrase = <DeviceClientMethods.EnablePassphraseFunction>
    _.partial(ApplySettingsAction.operation, this, _, null, null);
  public encryptNodeVector = <DeviceClientMethods.EncryptNodeVectorFunction>
    _.partial(CipherNodeVectorAction.operation, this, true, _);
  public decryptNodeVector = <DeviceClientMethods.DecryptNodeVectorFunction>
    (_.partial(CipherNodeVectorAction.operation, this, false, _));
  public encryptAccountName = <DeviceClientMethods.CipherAccountNameFunction>
    _.partial(CipherAccountNameAction.operation, this, true, _, _);
  public decryptAccountName = <DeviceClientMethods.CipherAccountNameFunction>
    (_.partial(CipherAccountNameAction.operation, this, false, _, _));
  public sendPassphrase = <DeviceClientMethods.SendPassphraseFunction>
    (_.partial(PassphraseAckAction.operation, this, _));
  public enablePolicy = <DeviceClientMethods.ApplyPolicyFunction>
    (_.partial(ApplyPolicyAction.operation, this, _, _));
  private _deviceMessenger: StatefulDeviceMessenger;
  public get deviceMessenger(): StatefulDeviceMessenger {
    if (!this._deviceMessenger) {
      this._deviceMessenger = new StatefulDeviceMessenger(this.transport);
      this._deviceMessenger.on(StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, (message: any) => {
        this.emit(DeviceClient.UNEXPECTED_MESSAGE_EVENT, message);
      });
    }
    return this._deviceMessenger;
  }

  private _featuresService: FeaturesService;
  get featuresService(): FeaturesService {
    if (!this._featuresService) {
      this._featuresService = new FeaturesService();
    }
    return this._featuresService;
  }

  private _transactionService: TransactionService;
  get transactionService(): TransactionService {
    return this._transactionService;
  }

  private devicePollingInterval: Timer = setInterval(() => {
    this.pollDevice();
  }, 0);

  constructor(public transport: Transport, public rawFirmwareStreamFactory: () => Readable) {
    super();
    this.addMessageHandler(ButtonRequestMessageHandler);
    this.addMessageHandler(EntropyRequestMessageHandler);
  }

  public destroy() {
    this.stopPolling();
    this.removeAllListeners();
    console.log("%s Disconnected: %d", this.deviceType, this.transport.deviceId);
  }

  public writeToDevice(message): Promise<any> {
    return this.deviceMessenger.send(message);
  }

  public addMessageHandler(handler: MessageHandlerClass, ...args) {
    var handlerInstance = new (Function.prototype.bind.apply(handler, arguments));
    _.each(handler.messageNames, (messageName: string) => {
      console.log(`${messageName} message handler added.`);
      this.addListener(messageName,
        this.messageHandlerWrapper(handlerInstance));
    });
  }

  public removeMessageHandler(handler: MessageHandlerClass) {
    _.each(handler.messageNames, (messageName: string) => {
      console.log(`${messageName} message handler removed.`);
      this.removeAllListeners(messageName);
    });
  }

  public stopPolling() {
    clearInterval(this.devicePollingInterval);
  }

  get deviceType() {
    return this.transport.vendorId;
  }

  private messageHandlerWrapper(handlerInstance) {
    return (...args) => {
      var reply = handlerInstance.messageHandler.apply(handlerInstance, args);
      if (reply) {
        this.writeToDevice(reply);
      }
    };
  }

  private pollDevice() {
    if (!this.transport.deviceInUse) {
      this.transport.deviceInUse = true;
      this.transport.read()
        .then((message: any) => {
          this.transport.deviceInUse = false;

          var hydratedMessage = DeviceMessageHelper.hydrate(message);

          console.log('device --> proxy: [%s]\n', message.$type.name,
            JSON.stringify(hydratedMessage, DeviceMessageHelper.buffer2Hex, 4));
          if (message) {
            if (this.deviceMessenger.receive.call(this.deviceMessenger, message)) {
              this.emit(hydratedMessage.typeName, hydratedMessage);
              if (hydratedMessage.request_type) {
                this.emit(`${hydratedMessage.typeName}_${hydratedMessage.request_type}`, hydratedMessage);
              }
            }
          }
        })
        .catch((err) => {
          //TODO Send this to the UI
          console.error('caught in client:', err);
          setTimeout(() => {
            this.transport.deviceInUse = false;
          });
        });
    }
  }
}
