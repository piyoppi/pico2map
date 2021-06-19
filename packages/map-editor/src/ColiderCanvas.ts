import { Project } from './Projects'
import { ColiderRenderer } from './ColiderRenderer'
import { ColiderTypes } from '@piyoppi/pico2map-tiled-colision-detector'
import { Pen } from './Brushes/Pen'
import { Brush } from './Brushes/Brush'
import { Brushes } from './Brushes/Brushes'
import { Arrangement, isColiderTypesRequired } from './Brushes/Arrangements/Arrangement'
import { ColiderArrangement } from './Brushes/Arrangements/ColiderArrangement'
import { EditorCanvas } from './EditorCanvas'

export class ColiderCanvas implements EditorCanvas {
  private _coliderCtx: CanvasRenderingContext2D | null = null
  private _secondaryCanvasCtx: CanvasRenderingContext2D | null = null
  private _secondaryCanvas: HTMLCanvasElement | null = null
  private _project: Project | null = null
  private _coliderRenderer: ColiderRenderer | null = null
  private _brush: Brush<ColiderTypes>
  private _arrangement: Arrangement<ColiderTypes> = new ColiderArrangement()
  private _isMouseDown = false
  private _lastMapChipPosition = {x: -1, y: -1}
  private _selectedColiderType: ColiderTypes = 0
  private _selectedSubColiderType: ColiderTypes = 0

  constructor() {
    this._brush = new Pen()
    this._setupBrush()
  }

  get selectedColiderType() {
    return this._selectedColiderType
  }

  get selectedSubColiderType() {
    return this._selectedSubColiderType
  }

  get project() {
    if (!this._project) throw new Error('The project is not set')

    return this._project
  }

  get coliderCtx() {
    if (!this._coliderCtx) throw new Error('A canvas is not set')

    return this._coliderCtx
  }

  get secondaryCanvasCtx() {
    if (!this._secondaryCanvasCtx) throw new Error('A canvas is not set')

    return this._secondaryCanvasCtx
  }

  get coliderRenderer() {
    if (!this._coliderRenderer) throw new Error('The project is not set')

    return this._coliderRenderer
  }

  get secondaryCanvas() {
    if (!this._secondaryCanvas) throw new Error('A canvas is not set')

    return this._secondaryCanvas
  }

  get isMouseDown() {
    return this._isMouseDown
  }

  get renderable() {
    return !!this._coliderCtx && !!this._coliderRenderer
  }

  setProject(project: Project) {
    this._project = project
    this._coliderRenderer = new ColiderRenderer(this._project.tiledMap)

    this._project.registerRenderAllCallback(() => {
      if (!this.renderable || !this._coliderCtx) return
      this.coliderRenderer.renderAll(this._coliderCtx)
    })

    if (this.renderable && this._coliderCtx) {
      this.coliderRenderer.renderAll(this._coliderCtx)
    }
  }

  setCanvas(canvas: HTMLCanvasElement, secondaryCanvas: HTMLCanvasElement) {
    this._coliderCtx = canvas.getContext('2d') as CanvasRenderingContext2D
    this._secondaryCanvasCtx = secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
    this._secondaryCanvas = secondaryCanvas

    if (this.renderable) {
      this.coliderRenderer.renderAll(this._coliderCtx)
    }
  }

  setBrush(brush: Brush<ColiderTypes>) {
    this._brush = brush
    this._setupBrush()
  }

  setArrangement(value: Arrangement<ColiderTypes>) {
    this._arrangement = value
  }

  setBrushFromName(brushName: string) {
    const registeredBrush = Brushes.find(registeredBrush => registeredBrush.name === brushName)

    if (!registeredBrush) {
      this.setBrush(new Pen())
    } else {
      this.setBrush(registeredBrush.create<ColiderTypes>())
    }
  }

  setColiderType(value: ColiderTypes) {
    this._selectedColiderType = value
  }

  setSubColiderType(value: ColiderTypes) {
    this._selectedSubColiderType = value
  }

  private _setupBrush(isSubButton: boolean = false) {
    this._brush.setArrangement(this._arrangement)

    if (isColiderTypesRequired(this._arrangement)) {
      this._arrangement.setColiderTypes(isSubButton ? this._selectedSubColiderType : this._selectedColiderType)
    }
  }

  mouseDown(x: number, y: number, isSubButton: boolean = false) {
    this._isMouseDown = true

    this._setupBrush(isSubButton)

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)
    this._brush.mouseDown(chipPosition.x, chipPosition.y)

    this._paint(chipPosition)

    this._lastMapChipPosition = chipPosition
  }

  mouseMove(x: number, y: number): {x: number, y: number} {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    if (!this._isMouseDown) return chipPosition
    if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y) return chipPosition

    this._paint(chipPosition)

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

  private _paint(chipPosition: {x: number, y: number}) {
    this.clearSecondaryCanvas()
    this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.item
      this.coliderRenderer.putOrClearChipToCanvas(this.secondaryCanvasCtx, chip, paint.x, paint.y, true)
    })
  }

  putChip(coliderType: ColiderTypes, chipX: number, chipY: number) {
    this.project.tiledMap.coliders.put(coliderType, chipX, chipY)
    this.coliderRenderer.putOrClearChipToCanvas(this.coliderCtx, coliderType, chipX, chipY)
  }

  private clearSecondaryCanvas() {
    this.secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.max(0, Math.min(Math.floor(x / this.project.tiledMap.chipWidth), this.project.tiledMap.chipCountX - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this.project.tiledMap.chipHeight), this.project.tiledMap.chipCountY - 1))
    }
  }
}
