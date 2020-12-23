import { TiledMap } from './TiledMap'
import { MapChip } from './MapChip'
import { Project } from './Projects'

export class MapCanvas {
  private _ctx = this.canvas.getContext('2d')
  private _isMouseDown = false

  constructor(
    private _project: Project,
    private canvas: HTMLCanvasElement,
  ) {
  }

  public mouseDown(x: number, y: number) {
    this._isMouseDown = true
  }

  public mouseMove(x: number, y: number) {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    if (this._isMouseDown) {
      this.putChip(this._project.mapChipSelector.selectedChip, chipPosition.x, chipPosition.y)
    }

    return chipPosition
  }

  public mouseUp() {
    this._isMouseDown = false
  }

  public putChip(mapChip: MapChip, chipX: number, chipY: number) {
    this._project.tiledMap.putChip(mapChip, chipX, chipY)

    const mapChips = this._project.tiledMap.mapChipsCollection.findById(mapChip.chipId)
    const image = mapChips?.image

    if (!image) return

    const position = this._project.tiledMap.convertChipPositionToPixel(chipX, chipY)
    this._ctx?.clearRect(position.x, position.y, this._project.tiledMap.chipWidth,  this._project.tiledMap.chipHeight)
    this._ctx?.drawImage(
      image,
      mapChip.x * this._project.tiledMap.chipWidth,
      mapChip.y * this._project.tiledMap.chipHeight,
      this._project.tiledMap.chipWidth,
      this._project.tiledMap.chipHeight,
      position.x,
      position.y,
      this._project.tiledMap.chipWidth,
      this._project.tiledMap.chipHeight,
    )
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.floor(x / this._project.tiledMap.chipWidth),
      y: Math.floor(y / this._project.tiledMap.chipHeight)
    }
  }
}
