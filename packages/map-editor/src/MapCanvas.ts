import { TiledMap, TiledMapData, TiledMapDataItem, MapChipFragment, MapChip } from '@piyoppi/tiled-map'
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
  private _ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
  private _secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
  private _isMouseDown = false
  private _brush: Brush<TiledMapDataItem> = new Pen()
  private _arrangement: Arrangement<TiledMapDataItem> = new DefaultArrangement()
  private _lastMapChipPosition = {x: -1, y: -1}
  private _renderer = new MapRenderer(this._project.tiledMap)

  constructor(
    private _project: Project,
    private canvas: HTMLCanvasElement,
    private secondaryCanvas: HTMLCanvasElement
  ) {
    this._project.registerRenderAllCallback(() => {
      this._renderer.renderAll(this._ctx)
    })
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
    if (!this._arrangement) return

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

    if (isMapChipFragmentRequired(this._arrangement)) {
    this._arrangement.setMapChips(this._project.mapChipSelector.selectedChips)
    }

    if (isAutoTileRequired(this._arrangement) && this._project.selectedAutoTile) {
      this._arrangement.setAutoTile(this._project.selectedAutoTile)
    }
    if (isAutoTilesRequired(this._arrangement)) {
      this._arrangement.setAutoTiles(this._project.tiledMap.autoTiles)
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
      const chip = paint.item
      this._renderer.putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true)
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
    this._project.tiledMap.put(mapChip, chipX, chipY)
    this._renderer.putOrClearChipToCanvas(this._ctx, mapChip, chipX, chipY)
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
