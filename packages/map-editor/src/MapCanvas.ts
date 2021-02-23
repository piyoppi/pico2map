import { TiledMapDataItem, MapChipFragment, MapChip, AutoTile } from '@piyoppi/tiled-map'
import { Project } from './Projects'
import { Pen } from './Brushes/Pen'
import { Brushes } from './Brushes/Brushes'
import { Arrangements } from './Brushes/Arrangements/Arrangements'
import { Brush } from './Brushes/Brush'
import { Arrangement, isMapChipFragmentRequired, isTiledMapDataRequired, isAutoTileRequired, isAutoTilesRequired } from './Brushes/Arrangements/Arrangement'
import { DefaultArrangement } from './Brushes/Arrangements/DefaultArrangement'
import { MapRenderer } from './MapRenderer'
import { EditorCanvas } from './EditorCanvas'

export class MapCanvas implements EditorCanvas {
  private _ctx: CanvasRenderingContext2D | null = null
  private _secondaryCanvasCtx: CanvasRenderingContext2D | null = null
  private _isMouseDown = false
  private _brush: Brush<TiledMapDataItem> = new Pen()
  private _arrangement: Arrangement<TiledMapDataItem> = new DefaultArrangement()
  private _lastMapChipPosition = {x: -1, y: -1}
  private _renderer: MapRenderer | null = null
  private canvas: HTMLCanvasElement | null = null
  private secondaryCanvas: HTMLCanvasElement | null = null
  private _project: Project | null = null
  private _selectedAutoTile: AutoTile | null = null
  private _selectedMapChipFragment: MapChipFragment | null = null

  constructor(
  ) {
  }

  get selectedAutoTile() {
    return this._selectedAutoTile
  }

  get selectedMapChipFragment() {
    return this._selectedMapChipFragment
  }

  get project() {
    if (!this._project) throw new Error('Project is not set')
    return this._project
  }

  get renderer() {
    if (!this._renderer) throw new Error('Project is not set')
    return this._renderer
  }

  hasActiveAutoTile() {
    return !!this._selectedAutoTile
  }

  setProject(project: Project) {
    this._project = project
    this._renderer = new MapRenderer(this._project.tiledMap)

    this._project.registerRenderAllCallback(() => {
      if (!this._ctx || !this._renderer) return
      this._renderer.renderAll(this._ctx)
    })
  }

  setCanvas(canvas: HTMLCanvasElement, secondaryCanvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.secondaryCanvas = secondaryCanvas
    this._ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this._secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  setAutoTile(value: AutoTile) {
    this._selectedAutoTile = value
  }

  setMapChipFragment(value: MapChipFragment) {
    this._selectedMapChipFragment = value
  }

  setBrushFromName(brushName: string) {
    const registeredBrush = Brushes.find(registeredBrush => registeredBrush.name === brushName)

    if (!registeredBrush) {
      this.setBrush(new Pen())
    } else {
      this.setBrush(registeredBrush.create<TiledMapDataItem>())
    }
  }

  setArrangementFromName(arrangementName: string) {
    const registeredArrangement = Arrangements.find(registered => registered.name === arrangementName)

    if (!registeredArrangement) {
      this.setArrangement(new DefaultArrangement())
    } else {
      this.setArrangement(registeredArrangement.create())
    }
  }

  private _setupBrush() {
    if (!this._project || !this._arrangement) return

    this._brush.setArrangement(this._arrangement)

    if (isTiledMapDataRequired(this._arrangement)) {
      this._arrangement.setTiledMapData(this._project.tiledMap.data)
    }
  }

  setArrangement(arrangement: Arrangement<TiledMapDataItem>) {
    this._arrangement = arrangement
    this._setupBrush()
  }

  setBrush(brush: Brush<TiledMapDataItem>) {
    this._brush = brush
    this._setupBrush()
  }

  mouseDown(x: number, y: number) {
    this._isMouseDown = true

    if (isMapChipFragmentRequired(this._arrangement) && this._selectedMapChipFragment) {
      this._arrangement.setMapChips([this._selectedMapChipFragment])
    }

    if (isAutoTileRequired(this._arrangement) && this._selectedAutoTile) {
      this._arrangement.setAutoTile(this._selectedAutoTile)
    }

    if (isAutoTilesRequired(this._arrangement)) {
      this._arrangement.setAutoTiles(this.project.tiledMap.autoTiles)
    }

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
      if (!this._secondaryCanvasCtx) return

      const chip = paint.item
      this.renderer.putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true)
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

  putChip(mapChip: MapChip | null, chipX: number, chipY: number) {
    if (!this._ctx) return

    this.project.tiledMap.put(mapChip, chipX, chipY)
    this.renderer.putOrClearChipToCanvas(this._ctx, mapChip, chipX, chipY)
  }

  private clearSecondaryCanvas() {
    if (!this.secondaryCanvas || !this._secondaryCanvasCtx) return

    this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.max(0, Math.min(Math.floor(x / this.project.tiledMap.chipWidth), this.project.tiledMap.chipCountX - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this.project.tiledMap.chipHeight), this.project.tiledMap.chipCountY - 1))
    }
  }
}
