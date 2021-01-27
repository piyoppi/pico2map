import { TiledMap, TiledMapData } from './TiledMap'
import { MapChipFragment, MapChip } from './MapChip'
import { Project } from './Projects'
import { Pen } from './Brushes/Pen'
import { Brushes } from './Brushes/Brushes'
import { Arrangements } from './Brushes/Arrangements/Arrangements'
import { Brush } from './Brushes/Brush'
import { Arrangement, isTiledMapDataRequired, isAutoTileRequired } from './Brushes/Arrangements/Arrangement'
import { DefaultArrangement } from './Brushes/Arrangements/DefaultArrangement'

export class MapCanvas {
  private _ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
  private _secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D
  private _isMouseDown = false
  private _brush: Brush = new Pen()
  private _arrangement: Arrangement = new DefaultArrangement()
  private _backgroundRgba = {r: 255, g: 255, b: 255, a: 1.0}
  private _lastMapChipPosition = {x: -1, y: -1}

  constructor(
    private _project: Project,
    private canvas: HTMLCanvasElement,
    private secondaryCanvas: HTMLCanvasElement,
  ) {
    this._project.registerRenderAllCallback(() => this.renderAll())
  }

  public setBrushFromName(brushName: string) {
    const registeredBrush = Brushes.find(registeredBrush => registeredBrush.name === brushName)

    if (!registeredBrush) {
      this.setBrush(new Pen())
    } else {
      this.setBrush(registeredBrush.create())
    }
  }

  public setArrangementFromName(arrangementName: string) {
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

  public setArrangement(arrangement: Arrangement) {
    this._arrangement = arrangement
    this._setupBrush()
  }

  public setBrush(brush: Brush) {
    this._brush = brush
    this._setupBrush()
  }

  public mouseDown(x: number, y: number) {
    this._isMouseDown = true

    this._arrangement.setMapChips(this._project.mapChipSelector.selectedChips)

    if (isAutoTileRequired(this._arrangement) && this._project.selectedAutoTile) {
      this._arrangement.setAutoTile(this._project.selectedAutoTile)
    }

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)
    this._brush.mouseDown(chipPosition.x, chipPosition.y)

    this._lastMapChipPosition = chipPosition
  }

  mouseMove(x: number, y: number) {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    if (!this._isMouseDown) return chipPosition
    if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y) return chipPosition

    this.clearSecondaryCanvas()
    this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
      const defaultChip = this._project.mapChipSelector.selectedChips[0]
      const chip = paint.chip
      this._putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true)
    })

    this._lastMapChipPosition = chipPosition

    return chipPosition
  }

  public mouseUp(x: number, y: number) {
    this._isMouseDown = false

    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
      const defaultChip = this._project.mapChipSelector.selectedChips[0]
      const chip = paint.chip
      this.putChip(chip, paint.x, paint.y)
    })

    this.clearSecondaryCanvas()
    this._brush.cleanUp()
    this._lastMapChipPosition = {x: -1, y: -1}
  }

  putChip(mapChip: MapChip | null, chipX: number, chipY: number) {
    this._project.tiledMap.put(mapChip, chipX, chipY)
    this._putOrClearChipToCanvas(this._ctx, mapChip, chipX, chipY)
  }

  renderAll() {
    this._project.tiledMap.data.mapData.forEach((value, index) => {
      const position = this._project.tiledMap.data.convertMapNumberToPosition(index)
      this._putOrClearChipToCanvas(this._ctx, value, position.x, position.y)
    })
  }

  private clearSecondaryCanvas() {
    this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  private _putOrClearChipToCanvas(ctx: CanvasRenderingContext2D, mapChip: MapChip | null, chipX: number, chipY: number, isTemporaryRendering: boolean = false) {
    if (mapChip instanceof MapChip) {
      mapChip.items.forEach(item => {
        this._putChipToCanvas(ctx, item, chipX, chipY)
      })
    } else {
      this._clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering)
    }
  }

  private _clearChipToCanvas(ctx: CanvasRenderingContext2D, chipX: number, chipY: number, isTemporaryRendering: boolean) {
    const position = this._project.tiledMap.convertChipPositionToPixel(chipX, chipY)

    ctx.clearRect(position.x, position.y, this._project.tiledMap.chipWidth, this._project.tiledMap.chipHeight)

    if (isTemporaryRendering) {
      ctx.fillStyle = `rgba(${this._backgroundRgba.r},${this._backgroundRgba.g},${this._backgroundRgba.b},${this._backgroundRgba.a})`
      ctx.fillRect(position.x, position.y, this._project.tiledMap.chipWidth, this._project.tiledMap.chipHeight)
    }
  }

  private _putChipToCanvas(ctx: CanvasRenderingContext2D, mapChip: MapChipFragment, chipX: number, chipY: number) {
    const mapChips = this._project.tiledMap.mapChipsCollection.findById(mapChip.chipId)
    const image = mapChips?.image
    if (!image) return

    const renderingArea = this._getRenderingArea(mapChip)
    const position = this._project.tiledMap.convertChipPositionToPixel(chipX, chipY)
    position.x += renderingArea.destOffsetX
    position.y += renderingArea.destOffsetY

    ctx.clearRect(position.x, position.y, renderingArea.width, renderingArea.height)
    ctx.drawImage(
      image,
      renderingArea.x,
      renderingArea.y,
      renderingArea.width,
      renderingArea.height,
      position.x,
      position.y,
      renderingArea.width,
      renderingArea.height
    )
  }

  private _getRenderingArea(mapChip: MapChipFragment) {
    const width = this._project.tiledMap.chipWidth
    const height = this._project.tiledMap.chipHeight
    const x = mapChip.x * width
    const y = mapChip.y * height

    if (mapChip.renderingArea === 15) {
      return {x, y, width, height, destOffsetX: 0, destOffsetY: 0}
    }

    const halfWidth = Math.round(width / 2)
    const halfHeight = Math.round(height / 2)

    switch(mapChip.renderingArea) {
      case 1:
        return {x, y, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: 0}
      case 2:
        return {x: x + halfWidth, y, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: 0}
      case 3:
        return {x, y, width, height: halfHeight, destOffsetX: 0, destOffsetY: 0}
      case 4:
        return {x, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight}
      case 5:
        return {x, y, width: halfWidth, height, destOffsetX: 0, destOffsetY: 0}
      case 8:
        return {x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: halfHeight}
      case 10:
        return {x: x + halfWidth, y, width: halfWidth, height, destOffsetX: halfWidth, destOffsetY: 0}
      case 12:
        return {x, y: y + halfHeight, width, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight}
    }
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.max(0, Math.min(Math.floor(x / this._project.tiledMap.chipWidth), this._project.tiledMap.chipCountX - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this._project.tiledMap.chipHeight), this._project.tiledMap.chipCountY - 1))
    }
  }
}