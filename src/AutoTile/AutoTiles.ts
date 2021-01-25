import { MapChipFragment, MapChipFragmentProperties } from './../MapChip'
import { AutoTileImportStrategy, MapChipFragmentGroups } from './ImportStrategy/ImportStrategy'

export type AutoTileProperties = {
  id: number,
  mapChipFragments: Array<MapChipFragmentProperties>
}

export class AutoTile {
  constructor(
    private _mapChipFragments: Array<MapChipFragment>,
    private _id: number
  ) {
  }

  get id() {
    return this._id
  }

  get mapChipFragments() {
    return this._mapChipFragments
  }

  toObject(): AutoTileProperties {
    return {
      id: this._id,
      mapChipFragments: this._mapChipFragments.map(fragment => fragment.toObject())
    }
  }

  static fromObject(val: AutoTileProperties): AutoTile {
    return new AutoTile(val.mapChipFragments.map(fragment => MapChipFragment.fromObject(fragment)), val.id)
  }
}

export type AutoTilesProperties = {
  autoTiles: Array<AutoTileProperties>
}

export class AutoTiles {
  private _autoTiles: Map<number, AutoTile> = new Map()
  private _maxId = 0

  get length() {
    return this._autoTiles.size
  }

  push(item: AutoTile) {
    this._autoTiles.set(item.id, item)
  }

  fromId(id: number): AutoTile | null {
    return this._autoTiles.get(id) || null
  }

  values() {
    return this._autoTiles.values()
  }

  import(strategy: AutoTileImportStrategy) {
    const mapChipFragmentGroups = strategy.getMapChipFragments()

    mapChipFragmentGroups.forEach(group => {
      const autoTile = new AutoTile(group, ++this._maxId)
      this.push(autoTile)
    })
  }

  toObject(): AutoTilesProperties {
    const objectedAutoTiles: Array<AutoTileProperties> = []
    const valuesItr = this._autoTiles.values()

    for(const val of valuesItr) {
      objectedAutoTiles.push(val.toObject())
    }

    return {
      autoTiles: objectedAutoTiles
    }
  }

  fromObject(val: AutoTilesProperties): void {
    this._autoTiles.clear()

    val.autoTiles.forEach(objectedAutoTile => {
      this.push(AutoTile.fromObject(objectedAutoTile))
    })
  }
}
