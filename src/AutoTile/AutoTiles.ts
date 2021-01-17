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
}

export class AutoTiles {
  private _autoTiles: Map<number, AutoTile> = new Map()
  private _maxId = 0

  push(item: AutoTile) {
    this._autoTiles.set(item.id, item)
  }

  import(strategy: AutoTileImportStrategy) {
    const mapChipFragmentGroups = strategy.getMapChipFragments()

    mapChipFragmentGroups.forEach(group => {
      const autoTile = new AutoTile(group, ++this._maxId)
      this.push(autoTile)
    })
  }
}
