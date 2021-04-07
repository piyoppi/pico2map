export class CallbackCaller {
  private _items: Array<CallbackItem> = []

  add(proc: () => void) {
    const callbackItem = new CallbackItem(proc)
    this._items.push(callbackItem)
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

export class CallbackItem {
  private _caller: any = null

  constructor(
    private _proc: () => void
  ) {
  }

  call() {
    if (!this._proc) new Error('Callback function is not set')

    this._proc?.call(this._caller)
  }
}
