import { CallbackCaller } from './CallbackCaller'
import { CallbackItem } from './CallbackItem'

export class CallbackCallers<T> {
  private _callers = new Map<T, CallbackCaller>()

  getCallbackCaller(key: T) {
    return this._callers.get(key)
  }

  has(key: T, callbackItem: CallbackItem) {
    return !!this._callers.get(key)?.has(callbackItem)
  }

  add(key: T, callback: () => void) {
    let caller = this._callers.get(key)

    if (!caller) {
      caller = new CallbackCaller()
      this._callers.set(key, caller)
    }

    return caller.add(callback)
  }

  call(key: T) {
    this._callers.get(key)?.call()
  }

  remove(key: T, callbackItem: CallbackItem) {
    this._callers.get(key)?.remove(callbackItem)
  }
}
