import { MapChipImage } from '../MapChipImage'
import { AutoTileImportStrategy } from './ImportStrategy'
import { AutoTileProperties, AutoTile } from './AutoTile'

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
    this._maxId = Math.max(this._maxId, item.id)
  }

  remove(item: AutoTile) {
    this._autoTiles.delete(item.id)
  }

  findByImage(image: MapChipImage): Array<AutoTile> {
    const valuesItr = this._autoTiles.values()

    return Array.from(valuesItr).filter(autoTile => autoTile.mapChipFragments.some(fragment => fragment.chipId === image.id))
  }

  fromId(id: number): AutoTile | null {
    return this._autoTiles.get(id) || null
  }

  values() {
    return this._autoTiles.values()
  }

  import(strategy: AutoTileImportStrategy): Array<AutoTile> {
    const mapChipFragmentGroups = strategy.getMapChipFragments()

    return mapChipFragmentGroups.map(group => {
      const autoTile = new AutoTile(group, ++this._maxId)
      this.push(autoTile)

      return autoTile
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
      const autoTile = AutoTile.fromObject(objectedAutoTile)
      this.push(autoTile)
      this._maxId = Math.max(this._maxId, autoTile.id)
    })
  }
}
