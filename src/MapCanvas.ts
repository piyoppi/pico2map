import { TiledMap } from './TiledMap'
import { MapChip } from './MapChip'
import { Project } from './Projects'
import { Pen } from './Brushes/Pen'
import { RectangleBrush } from './Brushes/RectangleBrush'

export class MapCanvas {
  private _ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
  private _secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
  private _isMouseDown = false
  private _brush = new Pen()

  constructor(
    private _project: Project,
    private canvas: HTMLCanvasElement,
    private secondaryCanvas: HTMLCanvasElement,
  ) {
  }

  public mouseDown(x: number, y: number) {
    this._isMouseDown = true

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)
    this._brush.mouseDown(chipPosition.x, chipPosition.y)
  }

  public mouseMove(x: number, y: number) {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    this.clearSecondaryCanvas()
    this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.chip || this._project.mapChipSelector.selectedChip
      this._putChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y)
    })

    return chipPosition
  }

  public mouseUp(x: number, y: number) {
    this._isMouseDown = false

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.chip || this._project.mapChipSelector.selectedChip
      this.putChip(chip, paint.x, paint.y)
    })

    this.clearSecondaryCanvas()
    this._brush.cleanUp()
  }

  public putChip(mapChip: MapChip, chipX: number, chipY: number) {
    this._project.tiledMap.putChip(mapChip, chipX, chipY)
    this._putChipToCanvas(this._ctx, mapChip, chipX, chipY)
  }

  private clearSecondaryCanvas() {
    this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  private _putChipToCanvas(ctx: CanvasRenderingContext2D, mapChip: MapChip, chipX: number, chipY: number) {
    const mapChips = this._project.tiledMap.mapChipsCollection.findById(mapChip.chipId)
    const image = mapChips?.image
    if (!image) return

    const position = this._project.tiledMap.convertChipPositionToPixel(chipX, chipY)
    ctx.clearRect(position.x, position.y, this._project.tiledMap.chipWidth,  this._project.tiledMap.chipHeight)
    ctx.drawImage(
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
