/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { transferEach } from './TransferEach'
import { MapMatrix } from './MapMatrix'
import { MapChipComparable } from '../MapChip'

type MapPaletteMatrixItem<T> = (T & MapChipComparable) | null

export class MapPaletteMatrix<T> {
  private _paletteIndexes: Map<string, number> = new Map()
  private _values = new MapMatrix<number>(0, 0, [])
  private _palette: Array<MapPaletteMatrixItem<T>> = []

  constructor(
    chipCountX: number,
    chipCountY: number,
    items: Array<MapPaletteMatrixItem<T>> = [],
  ) {
    this._values = new MapMatrix<number>(chipCountX, chipCountY, new Array(chipCountY * chipCountX).fill(-1))

    if (items.length > 0) {
      this.set(items)
    }
  }

  get size() {
    return this._values.size
  }

  get width() {
    return this._values.width
  }

  get height() {
    return this._values.height
  }

  get items(): Array<MapPaletteMatrixItem<T>> {
    return this._values.items.map(value => value >= 0 ? this._palette[value] : null)
  }

  get palette() {
    return this._palette
  }

  get values() {
    return this._values
  }

  set(items: Array<MapPaletteMatrixItem<T>>) {
    if (items.length !== this._values.items.length) throw new Error()

    this._values.set(items.map(value => this._getOrGeneratePaletteIndex(value)))
  }

  setValuePalette(values: Array<number>, palette: Array<MapPaletteMatrixItem<T>>) {
    if (values.length !== this._values.items.length) throw new Error()

    this._values.set([...values])
    this._palette = [...palette]

    this._paletteIndexes.clear()

    for (const [index, paletteItem] of this._palette.entries()) {
      if (!paletteItem) continue

      if (this._paletteIndexes.has(paletteItem.identifyKey)) {
        this.rebuild()
        break
      }

      this._paletteIndexes.set(paletteItem.identifyKey, index)
    }
  }

  transferFromTiledMapData(src: MapPaletteMatrix<T>, srcX: number, srcY: number, width: number, height: number, destX: number, destY: number) {
    transferEach(
      srcX, srcY, width, height, destX, destY,
      src.width, src.height, this.width, this.height,
      (pickupX, pickupY, putX, putY) => {
        const item = src.getFromChipPosition(pickupX, pickupY)
        this._values.put(this._getOrGeneratePaletteIndex(item), putX, putY)
      }
    )
  }

  resize(chipCountX: number, chipCountY: number, emptyValue: MapPaletteMatrixItem<T>) {
    this._values.resize(chipCountX, chipCountY, this._getOrGeneratePaletteIndex(emptyValue))
  }

  getFromChipPosition(x: number, y: number): MapPaletteMatrixItem<T> {
    const paletteIndex = this._values.getFromChipPosition(x, y)

    return paletteIndex >= 0 ? this._palette[paletteIndex] : null
  }

  put(item: MapPaletteMatrixItem<T>, x: number, y: number) {
    this._values.put(this._getOrGeneratePaletteIndex(item), x, y)
  }

  clone() {
    const cloned = new MapPaletteMatrix(this.width, this.height)
    cloned.setValuePalette(this._values.items, this._palette)

    return cloned
  }

  rebuild() {
    const items = this.items
    this._palette = []
    this._paletteIndexes.clear()
    this.set(items)
  }

  remove(target: MapPaletteMatrixItem<T>): boolean {
    if (!target) return false

    const removePaletteId = this.palette.findIndex(item => item?.identifyKey === target.identifyKey)
    if (removePaletteId < 0) return false

    this.palette.splice(removePaletteId, 1)

    this.values.items.forEach((paletteIndex, valueIndex) => {
      if (paletteIndex === removePaletteId) this.values.items[valueIndex] = -1
      if (paletteIndex > removePaletteId) this.values.items[valueIndex] = this.values.items[valueIndex] - 1
    })

    for (const [k, v] of this._paletteIndexes.entries()) {
      if (v > removePaletteId) this._paletteIndexes.set(k, v - 1)
    }

    this._paletteIndexes.delete(target.identifyKey)

    return true
  }

  getPaletteIndex(value: MapPaletteMatrixItem<T>) {
    if (value === null) return -1

    return this._paletteIndexes.get(value.identifyKey)
  }

  private _getOrGeneratePaletteIndex(value: MapPaletteMatrixItem<T>): number {
    if (value === null) return -1

    const index = this.getPaletteIndex(value)
    if (index !== undefined) return index

    this._palette.push(value)

    const addedIndex = this._palette.length - 1
    this._paletteIndexes.set(value.identifyKey, addedIndex)

    return addedIndex
  }
}
