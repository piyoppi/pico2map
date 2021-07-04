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

  findById(chipId: number) {
    return this._items.get(chipId) || null
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
