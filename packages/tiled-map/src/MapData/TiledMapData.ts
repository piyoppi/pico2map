import { MapChip, MapChipProperties,  AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './../MapChip'
import { MapMatrix } from './MapMatrix'

export type TiledMapDataItem = MapChip | null

export type TiledMapDataProperties = {
  chipCountX: number,
  chipCountY: number,
  mapData: Array<MapChipProperties | AutoTileMapChipProperties | null>
}

export class TiledMapData extends MapMatrix<TiledMapDataItem> {
  filter(needles: Array<MapChip>): TiledMapData {
    const filtered = this._items.map(chip => needles.some(needle => !!chip && needle.compare(chip)) ? chip : null)
    return new TiledMapData(
      this.width,
      this.height,
      filtered
    )
  }

  toObject(): TiledMapDataProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      mapData: this._items.map(data => data?.toObject() || null)
    }
  }

  static fromObject(val: TiledMapDataProperties) {
    const mapData = val.mapData.map(data => {
      if (!data) return null

      if (isAutoTileMapChipProperties(data)) {
        return AutoTileMapChip.fromObject(data)
      }

      return MapChip.fromObject(data)

    })

    return new TiledMapData(val.chipCountX, val.chipCountY, mapData)
  }
}
