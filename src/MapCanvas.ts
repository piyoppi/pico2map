import { TiledMap } from './TiledMap'
import { MapChip } from './MapChip'

export class MapCanvas {
  private _ctx = this.canvas.getContext('2d')

  constructor(
    private tiledMap: TiledMap,
    private canvas: HTMLCanvasElement
  ) {

  }

  public putChip(mapChip: MapChip, chipX: number, chipY: number) {
    this.tiledMap.putChip(mapChip, chipX, chipY)

    const mapChips = this.tiledMap.mapChipsCollection.findById(mapChip.chipId)
    const image = mapChips?.image

    if (!image) return

    const position = this.tiledMap.convertChipPositionToPixel(chipX, chipY)
    this._ctx?.drawImage(
      image,
      mapChip.x * this.tiledMap.chipWidth,
      mapChip.y * this.tiledMap.chipHeight,
      this.tiledMap.chipWidth,
      this.tiledMap.chipHeight,
      position.x,
      position.y,
      this.tiledMap.chipWidth,
      this.tiledMap.chipHeight,
    )
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.floor(x / this.tiledMap.chipWidth),
      y: Math.floor(y / this.tiledMap.chipHeight)
    }
  }
}
