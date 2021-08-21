/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { CallbackItem } from './CallbackItem'

export class CallbackCaller {
  private _items: Array<CallbackItem> = []
  private _maxId = 1

  get length() {
    return this._items.length
  }

  has(callbackItem: CallbackItem) {
    return !!this._items.find(item => item === callbackItem)
  }

  add(proc: () => void): CallbackItem {
    const callbackItem = new CallbackItem(proc, this._maxId++)
    this._items.push(callbackItem)

    return callbackItem
  }

  call() {
    this._items.forEach(item => item.call())
  }

  remove(removedCallbackItem: CallbackItem) {
    const index = this._items.findIndex(item => item === removedCallbackItem)

    if (index < 0) throw Error('CallbackCaller is not found')

    this._items.splice(index, 1)
  }
}
