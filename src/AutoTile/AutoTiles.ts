import { MapChipFragment } from './../MapChip'
import { AutoTileImportStrategy, MapChipFragmentGroups } from './ImportStrategy/ImportStrategy'

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
}
