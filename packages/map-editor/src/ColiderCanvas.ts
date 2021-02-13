import { Project } from './Projects'
import { ColiderRenderer } from './ColiderRenderer'
import { ColiderTypes } from '@piyoppi/tiled-map'
import { Pen } from './Brushes/Pen'
import { Brush } from './Brushes/Brush'
import { Arrangement, isColiderTypesRequired } from './Brushes/Arrangements/Arrangement'
import { ColiderArrangement } from './Brushes/Arrangements/ColiderArrangement'
import { EditorCanvas } from './EditorCanvas'

export class ColiderCanvas implements EditorCanvas {
  private _coliderCtx = this.coliderCanvas.getContext('2d') as CanvasRenderingContext2D
  private _secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
  private _coliderRenderer = new ColiderRenderer(this._project.tiledMap)
  private _brush: Brush<ColiderTypes>
  private _arrangement: Arrangement<ColiderTypes> = new ColiderArrangement()
  private _isMouseDown = false
  private _lastMapChipPosition = {x: -1, y: -1}
  private _selectedColiderType: ColiderTypes = 'none'

  constructor(
    private _project: Project,
    private coliderCanvas: HTMLCanvasElement,
    private secondaryCanvas: HTMLCanvasElement
  ) {
    this._project.registerRenderAllCallback(() => {
      this._coliderRenderer.renderAll(this._coliderCtx)
    })

    this._brush = new Pen()
    this._setupBrush()
  }

  get selectedColiderType() {
    return this._selectedColiderType
  }

  setBrush(brush: Brush<ColiderTypes>) {
    this._brush = brush
    this._setupBrush()
  }

  setColiderType(value: ColiderTypes) {
    this._selectedColiderType = value
  }

  private _setupBrush() {
    if (!this._arrangement) return

    this._brush.setArrangement(this._arrangement)

    if (isColiderTypesRequired(this._arrangement)) {
      this._arrangement.setColiderTypes(this._selectedColiderType)
    }
  }

  mouseDown(x: number, y: number) {
    this._isMouseDown = true

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)
    this._brush.mouseDown(chipPosition.x, chipPosition.y)

    this._lastMapChipPosition = chipPosition
  }

  mouseMove(x: number, y: number): {x: number, y: number} {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    if (!this._isMouseDown) return chipPosition
    if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y) return chipPosition

    this.clearSecondaryCanvas()
    this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.item
      this._coliderRenderer.putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true)
    })

    this._lastMapChipPosition = chipPosition

    return chipPosition
  }

  mouseUp(x: number, y: number) {
    this._isMouseDown = false

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.item
      this.putChip(chip, paint.x, paint.y)
    })

    this.clearSecondaryCanvas()
    this._brush.cleanUp()
    this._lastMapChipPosition = {x: -1, y: -1}
  }

  putChip(coliderType: ColiderTypes, chipX: number, chipY: number) {
    this._project.tiledMap.coliders.put(coliderType, chipX, chipY)
    this._coliderRenderer.putOrClearChipToCanvas(this._coliderCtx, coliderType, chipX, chipY)
  }

  private clearSecondaryCanvas() {
    this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.max(0, Math.min(Math.floor(x / this._project.tiledMap.chipWidth), this._project.tiledMap.chipCountX - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this._project.tiledMap.chipHeight), this._project.tiledMap.chipCountY - 1))
    }
  }
}
