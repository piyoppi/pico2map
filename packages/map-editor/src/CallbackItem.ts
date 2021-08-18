/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export class CallbackItem {
  private _caller: any = null

  constructor(
    private _proc: () => void,
    private _id: number = -1
  ) {
  }

  get id() {
    return this._id
  }

  call() {
    if (!this._proc) new Error('Callback function is not set')

    this._proc.call(this._caller)
  }
}
