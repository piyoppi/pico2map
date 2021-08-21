/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { transferEach } from './TransferEach'

export class MapMatrix<T> {
  protected _items: Array<T> = []

  constructor(
    protected _chipCountX: number,
    protected _chipCountY: number,
    items: Array<T> = []
  ) {
    if (items.length > 0 && this.size !== items.length) {
      throw new Error()
    }

    if (items.length === 0) {
      this.allocate()
    } else {
      this._items = items
    }
  }

  get size() {
    return this._chipCountX * this._chipCountY
  }

  get width() {
    return this._chipCountX
  }

  get height() {
    return this._chipCountY
  }

  get items() {
    return this._items
  }

  set(items: Array<T>) {
    if (items.length !== this._items.length) throw new Error()

    this._items = items
  }

  transferFromTiledMapData(src: MapMatrix<T>, srcX: number, srcY: number, width: number, height: number, destX: number, destY: number) {
    transferEach(
      srcX, srcY, width, height, destX, destY,
      src.width, src.height, this.width, this.height,
      (pickupX, pickupY, putX, putY) => {
        const item = src.getFromChipPosition(pickupX, pickupY)
        this.put(item, putX, putY)
      }
    )
  }

  resize(chipCountX: number, chipCountY: number, emptyValue: T) {
    const src = this.clone()

    this._chipCountX = chipCountX
    this._chipCountY = chipCountY

    this.allocate(emptyValue)

    this.transferFromTiledMapData(src, 0, 0, src.width, src.height, 0, 0)
  }

  getFromChipPosition(x: number, y: number): T {
    if (this.isOutOfRange(x, y)) throw new Error('The position is out of range.')

    const mapNumber = this.convertPositionToMapNumber(x, y)
    return this._items[mapNumber]
  }

  put(item: T, x: number, y: number) {
    const mapNumber = this.convertPositionToMapNumber(x, y)
    this._items[mapNumber] = item 
  }

  clone() {
    return new MapMatrix<T>(this._chipCountX, this._chipCountY, this._items)
  }

  convertPositionToMapNumber(x: number, y: number) {
    return y * this._chipCountX + x
  }

  protected isOutOfRange(x: number, y: number): boolean {
    return (x < 0)  || (y < 0) || (x >= this._chipCountX) || (y >= this._chipCountY)
  }

  protected allocate(defaultValue: T | null = null) {
    this._items = new Array(this._chipCountY * this._chipCountX).fill(defaultValue)
  }
}
