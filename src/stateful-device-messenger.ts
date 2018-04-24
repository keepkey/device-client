import * as _ from 'lodash';

import {DeviceMessageHelper} from "./device-message-helper";
import {DeviceMessageStates} from "./device-message-states";
import {MessageState} from "./message-states";
import EventEmitter = require('events');
import {ReflectableProtoBufModel} from "./global/message-handler";

interface WriteRequestInProgress extends MessageState {
  resolve?: (any) => any;
  reject?: (any) => any;
}

export class StatefulDeviceMessenger extends EventEmitter {
  public static UNEXPECTED_MESSAGE_EVENT = 'unexpected-message';

  private writeRequestInProgress: Array<WriteRequestInProgress> = [];
  private pendingMessageQueue: Array<any> = [];
  private isDisabled: boolean = false;

  constructor(private transport) {
    super();
  }

  /***
   * Send a message the device
   * @param message
   * @returns {Promise<any>}
   */
  public send(message: ReflectableProtoBufModel): Promise<any> {
    //TODO Don't send messages when the device is in the wrong mode
    if (this.isDisabled) {
      return Promise.reject("failed state");
    }
      var messageType = message.$type.name;
      var state = DeviceMessageStates.getHostMessageState(messageType);

      console.assert(state, `Unknown message: ${messageType}`)

      if (this.writeRequestInProgress.length) {
        var lastRequest = _.last(this.writeRequestInProgress);
        if (lastRequest.resolveMessage === messageType) {
          this.writeRequestInProgress.pop();
        } else if (messageType === DeviceMessageStates.Cancel) {
          _.each(this.writeRequestInProgress, (request: WriteRequestInProgress) => {
            request.reject && request.reject(`${request.messageName} cancelled`);
          });
          this.writeRequestInProgress.length = 0;
          this.cancelPendingRequests();
        } else if (!DeviceMessageStates.isInterstitialMessage(lastRequest, messageType)) {
          return this.enqueueMessage(message);
        }
      }

      return new Promise((resolve, reject) => {
        if (state && state.resolveMessage) {
          var requestInProgress = <WriteRequestInProgress>(_.extend({
            resolve: resolve,
            reject : reject
          }, state));
          this.writeRequestInProgress.push(requestInProgress);
        } else {
          resolve();
        }

        console.log('proxy --> device:\n    [%s] %s\n    WaitFor: %s',
          message.$type.name, DeviceMessageHelper.toPrintable(message),
          state && state.resolveMessage);

        this.transport.write.call(this.transport, message)
          .then(() => {
            if (this.writeRequestInProgress.length === 0) {
              this.dequeueMessage();
            }
          })
          .catch(() => {
            console.log('Failed when writing to device');
            this.writeRequestInProgress.length = 0;
            this.cancelPendingRequests();
            reject.apply(message);
          });
      });

  }

  /***
   * Process an received message
   * @param message
   * returns true when a valid message is received
   */
  public receive(message): boolean {
    var messageType = message.$type.name;
    var hydratedMessage = DeviceMessageHelper.hydrate(message);
    if (!this.isDisabled) {
      if (this.writeRequestInProgress.length) {
        var writeRequest = _.last(this.writeRequestInProgress);

        if (messageType === DeviceMessageStates.TxRequest) {
          messageType += '_' + hydratedMessage.request_type;
        }

        if (writeRequest.resolveMessage === messageType) {
          // Got the expected response
          this.writeRequestInProgress.pop();
          writeRequest.resolve(hydratedMessage);
          this.dequeueMessage();
        } else if (
          DeviceMessageStates.isInterstitialMessage(writeRequest, messageType)) {
          // Got an interstitial message
          this.writeRequestInProgress.push(
            DeviceMessageStates.getDeviceMessageState(message.$type.name));
          return true;
        } else if (writeRequest.rejectMessage === messageType) {
          // Got the failure response
          this.writeRequestInProgress.pop();
          writeRequest.reject(hydratedMessage);
        } else {
          this.cancelPendingRequests();
          this.isDisabled = true;
          this.emit(StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, {
            message: messageType
          });
        }
      } else if (messageType === 'Failure') {
        // Unexpected failure is handled elsewhere, so don't put it in the error log
      } else {
        // Not expecting a message
        console.error('no incoming messages expected. got:', messageType);
        this.isDisabled = true;
        this.emit(StatefulDeviceMessenger.UNEXPECTED_MESSAGE_EVENT, {
          message: messageType
        });

      }
    }
    return !this.isDisabled;
  }

  private cancelPendingRequests() {
    _.each(this.pendingMessageQueue, (pendingMessage) => {
      pendingMessage.reject(
        `${pendingMessage.message.$type.name} not sent due to Cancel request`
      );
    });
    this.pendingMessageQueue.length = 0;
  };

  private enqueueMessage(message): Promise<any> {
    var resolver, rejector;

    var promise = new Promise((resolve, reject) => {
      resolver = resolve;
      rejector = reject;
    });

    this.pendingMessageQueue.push({
      message: message,
      resolve: resolver,
      reject: rejector
    });

    return promise;
  }

  private dequeueMessage() {
    if (this.pendingMessageQueue.length) {
      var pendingMessage = this.pendingMessageQueue.shift();
      this.send(pendingMessage.message)
        .then(pendingMessage.resolve)
        .catch(pendingMessage.reject);
    }
  }
}
