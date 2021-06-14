import { MapChip, MapChipProperties,  AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './../MapChip'
import { MapPaletteMatrix } from './MapPaletteMatrix'

export type TiledMapDataItem = MapChip | null

export type TiledMapDataProperties = {
  chipCountX: number,
  chipCountY: number,
  mapData: Array<MapChipProperties | AutoTileMapChipProperties | null>
}

export class TiledMapData extends MapPaletteMatrix<TiledMapDataItem> {
  filter(needles: Array<MapChip>): TiledMapData {
    const filtered = this.items.map(chip => needles.some(needle => !!chip && needle.compare(chip)) ? chip : null)
    return new TiledMapData(
      this.width,
      this.height,
      filtered
    )
  }

  toObject(): TiledMapDataProperties {
    return {
      chipCountX: this.width,
      chipCountY: this.height,
      mapData: this.items.map(data => data ? (data as MapChip).toObject() : null)
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
