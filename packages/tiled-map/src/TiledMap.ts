import { MapChip } from './MapChip'
import { MapChipsCollection, MapChipCollectionProperties } from './MapChips'
import { AutoTiles, AutoTilesProperties } from './AutoTile/AutoTiles'
import { TiledMapData, TiledMapDataProperties } from './MapData/TiledMapData'
import { ColiderMap, ColiderMapProperties } from './MapData/ColiderMap'

export type TiledMapProperties = {
  chipCountX: number,
  chipCountY: number,
  chipWidth: number,
  chipHeight: number,
  mapChipImages: MapChipCollectionProperties,
  autoTiles: AutoTilesProperties,
  tiledMapData: TiledMapDataProperties,
  coliders: ColiderMapProperties
}

export class TiledMap {
  private _mapChipImages = new MapChipsCollection()
  private _autoTiles = new AutoTiles()
  private _data = new TiledMapData(this._chipCountX, this._chipCountY)
  private _coliders = new ColiderMap(this._chipCountX, this._chipCountY)

  constructor(
    private _chipCountX: number,
    private _chipCountY: number,
    private _chipWidth: number,
    private _chipHeight: number
  ) {
  }

  get chipWidth() {
    return this._chipWidth
  }

  get chipHeight() {
    return this._chipHeight
  }

  get chipCountX() {
    return this._chipCountX
  }

  get chipCountY() {
    return this._chipCountY
  }

  get mapChipsCollection() {
    return this._mapChipImages
  }

  get autoTiles() {
    return this._autoTiles
  }

  get data() {
    return this._data
  }

  get coliders() {
    return this._coliders
  }

  convertChipPositionToPixel(chipX: number, chipY: number) {
    return {
      x: chipX * this.chipWidth,
      y: chipY * this.chipHeight
    }
  }

  put(mapChip: MapChip | null, chipX: number, chipY: number) {
    this._data.put(mapChip, chipX, chipY)
  }

  toObject(): TiledMapProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      chipWidth: this._chipWidth,
      chipHeight: this._chipHeight,
      mapChipImages: this._mapChipImages.toObject(),
      autoTiles: this._autoTiles.toObject(),
      tiledMapData: this._data.toObject(),
      coliders: this._coliders.toObject()
    }
  }

  private setSerializedProperties(val: {mapChipImages: MapChipCollectionProperties, autoTiles: AutoTilesProperties, tiledMapData: TiledMapDataProperties, coliders: ColiderMapProperties}) {
    this._mapChipImages.fromObject(val.mapChipImages)
    this._autoTiles.fromObject(val.autoTiles)
    this._data = TiledMapData.fromObject(val.tiledMapData)
    this._coliders = ColiderMap.fromObject(val.coliders)
  }

  static fromObject(val: TiledMapProperties) {
    const tiledMap = new TiledMap(val.chipCountX, val.chipCountY, val.chipWidth, val.chipHeight)
    tiledMap.setSerializedProperties({mapChipImages: val.mapChipImages, autoTiles: val.autoTiles, tiledMapData: val.tiledMapData, coliders: val.coliders})

    return tiledMap
  }
}
