import { MapChip, MapChipProperties,  AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './MapChip'
import { MapChipImage, MapChipsCollection, MapChipCollectionProperties, MapChipImageProperties } from './MapChips'
import { AutoTiles, AutoTilesProperties } from './AutoTile/AutoTiles'

export type TiledMapDataProperties = {
  chipCountX: number,
  chipCountY: number,
  mapData: Array<MapChipProperties | AutoTileMapChipProperties | null>
}

export class TiledMapData {
  constructor(
    private _chipCountX: number,
    private _chipCountY: number,
    private _mapData: Array<MapChip | null> = []
  ) {
    if (this._mapData.length > 0 && this.size !== this._mapData.length) {
      throw new Error()
    }

    if (this._mapData.length === 0) this.allocate()
  }

  get size() {
    return this._chipCountX * this._chipCountY
  }

  get width() {
    return this._chipCountX
  }

  get height() {
    return this._chipCountY
  }

  get mapData() {
    return this._mapData
  }

  set(mapData: Array<MapChip | null>) {
    if (mapData.length !== this._mapData.length) throw new Error()

    this._mapData = mapData
  }

  transferFromTiledMapData(src: TiledMapData, srcX: number, srcY: number, width: number, height: number, destX: number, destY: number) {
    for(let x = 0; x < width; x++) {
      const putX = destX + x
      const pickupX = srcX + x
      if (putX < 0 || putX >= this.width) continue;
      if (pickupX < 0 || pickupX >= src.width) continue;

      for(let y = 0; y < height; y++) {
        const putY = destY + y
        const pickupY = srcY + y
        if (putY < 0 || putY >= this.height) continue;
        if (pickupY < 0 || pickupY >= src.height) continue;

        this.put(src.getMapDataFromChipPosition(pickupX, pickupY), putX, putY)
      }
    }
  }

  filter(needles: Array<MapChip>): TiledMapData {
    const filtered = this._mapData.map(chip => needles.some(needle => !!chip && needle.compare(chip)) ? chip : null)
    return new TiledMapData(
      this.width,
      this.height,
      filtered
    )
  }

  getMapDataFromChipPosition(x: number, y: number): MapChip | null {
    if ((x < 0)  || (y < 0) || (x >= this._chipCountX) || (y >= this._chipCountY)) return null

    const mapNumber = this.convertPositionToMapNumber(x, y)
    return this._mapData[mapNumber]
  }

  put(mapChip: MapChip | null, x: number, y: number) {
    const mapNumber = this.convertPositionToMapNumber(x, y)
    this._mapData[mapNumber] = mapChip
  }

  convertPositionToMapNumber(x: number, y: number) {
    return y * this._chipCountX + x
  }

  convertMapNumberToPosition(num: number) {
    return {
      x: Math.floor(num / this._chipCountY),
      y: num % this._chipCountY
    }
  }

  private allocate() {
    this._mapData = new Array(this._chipCountY * this._chipCountX).fill(null)
  }

  toObject(): TiledMapDataProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      mapData: this._mapData.map(data => data?.toObject() || null)
    }
  }

  static fromObject(val: TiledMapDataProperties) {
    const mapData = val.mapData.map(data => {
      if (isAutoTileMapChipProperties(data)) {
        return AutoTileMapChip.fromObject(data)
      } else if (data) {
        return MapChip.fromObject(data)
      }

      return null
    })

    return new TiledMapData(val.chipCountX, val.chipCountY, mapData)
  }
}

export type TiledMapProperties = {
  chipCountX: number,
  chipCountY: number,
  chipWidth: number,
  chipHeight: number,
  mapChipImages: MapChipCollectionProperties,
  autoTiles: AutoTilesProperties,
  tiledMapData: TiledMapDataProperties
}

export class TiledMap {
  private _mapChipImages = new MapChipsCollection()
  private _autoTiles = new AutoTiles()
  private _data = new TiledMapData(this._chipCountX, this._chipCountY)

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
      tiledMapData: this._data.toObject()
    }
  }

  private setSerializedProperties(val: {mapChipImages: MapChipCollectionProperties, autoTiles: AutoTilesProperties, tiledMapData: TiledMapDataProperties}) {
    this._mapChipImages.fromObject(val.mapChipImages)
    this._autoTiles.fromObject(val.autoTiles)
    this._data = TiledMapData.fromObject(val.tiledMapData)
  }

  static fromObject(val: TiledMapProperties) {
    const tiledMap = new TiledMap(val.chipCountX, val.chipCountY, val.chipWidth, val.chipHeight)
    tiledMap.setSerializedProperties({mapChipImages: val.mapChipImages, autoTiles: val.autoTiles, tiledMapData: val.tiledMapData})

    return tiledMap
  }
}
