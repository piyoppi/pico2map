/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { MapChipImage, MapChipImageProperties } from './MapChipImage'

export type MapChipCollectionProperties = {
  items: Array<MapChipImageProperties>
}

export class MapChipsCollection {
  private _items: Map<number, MapChipImage> = new Map()

  push(item: MapChipImage) {
    this._items.set(item.id, item)
  }

  remove(item: MapChipImage) {
    this._items.delete(item.id)
  }

  replace(replacement: MapChipImage) {
    const target = this.findById(replacement.id)

    if (!target) throw new Error('Target MapChipImage cannot be found.')

    this.remove(target)
    this.push(replacement)
  }

  findById(chipId: number) {
    return this._items.get(chipId) || null
  }

  getItems(): Array<MapChipImage> {
    return Array.from(this._items.values())
  }

  async waitWhileLoading(): Promise<void> {
    await Promise.all(Array.from(this._items.values()).map( item => item.waitWhileLoading()))
  }

  toObject(): MapChipCollectionProperties {
    const objectedMapChipImage: Array<MapChipImageProperties> = []
    const valuesItr = this._items.values()

    for(const val of valuesItr) {
      objectedMapChipImage.push(val.toObject())
    }
    return {
      items: objectedMapChipImage
    }
  }

  fromObject(val: MapChipCollectionProperties): void {
    this._items.clear()

    val.items.forEach(objectedVal => {
      this.push(MapChipImage.fromObject(objectedVal))
    })
  }
}
