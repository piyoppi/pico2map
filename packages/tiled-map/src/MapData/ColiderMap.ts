import { MapChip, MapChipProperties,  AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './../MapChip'
import { MapMatrix } from './MapMatrix'

export type ColiderValues = 'colider' | 'none'

export type ColiderMapProperties = {
  chipCountX: number,
  chipCountY: number,
  coliders: Array<ColiderValues>
}

export class ColiderMap extends MapMatrix<ColiderValues> {
  toObject(): ColiderMapProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      coliders: this._items
    }
  }

  static fromObject(val: ColiderMapProperties) {
    return new ColiderMap(val.chipCountX, val.chipCountY, val.coliders)
  }
}
