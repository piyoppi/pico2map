import { MapChip } from './MapChip'
import { MapChips, MapChipsCollection } from './MapChips'

export class TiledMap {
  private _chipCountX = 0
  private _chipCountY = 0
  private _chipWidth = 0
  private _chipHeight = 0
  private _mapData: Array<MapChip | null> = []
  private _mapChips = new MapChipsCollection()

  constructor() {
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
    return this._mapChips
  }

  public initialize(chipCountX: number, chipCountY: number, chipWidth: number, chipHeight: number) {
    this.setMapSize(chipCountX, chipCountY)
    this._chipWidth = chipWidth
    this._chipHeight = chipHeight

    this.allocateMapData()
  }

  public setMapSize(chipCountX: number, chipCountY: number) {
    this._chipCountX = chipCountX
    this._chipCountY = chipCountY

    this.allocateMapData()
  }

  public putChip(mapChip: MapChip, chipX: number, chipY: number) {
    const mapNumber = this.convertPositionToMapNumber(chipX, chipY)
    this._mapData[mapNumber] = mapChip
  }

  public convertPositionToMapNumber(chipX: number, chipY: number) {
    return chipY * this._chipCountY + chipX
  }

  public convertChipPositionToPixel(chipX: number, chipY: number) {
    return {
      x: chipX * this.chipWidth,
      y: chipY * this.chipHeight
    }
  }

  private allocateMapData() {
    this._mapData = new Array(this._chipCountY * this._chipCountX).fill(null)
  }
}
