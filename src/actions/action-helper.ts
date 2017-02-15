import * as _ from 'lodash';

export class ActionHelper {
  public static ignoreCancelledAction(message: string | any) {
    if (!ActionHelper.isCancelledMessage(message)) {
      return Promise.reject(message);
    }
  }

  public static isCancelledMessage(message: string | any): boolean {
    return (_.isString(message) && message.endsWith('cancelled')) ||
      (_.isString(message.code) && message.code.endsWith('Cancelled'));
  }
}