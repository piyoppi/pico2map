import { TiledMapDataItem, MapChipFragment, MapChip, AutoTile, MapRenderer, isAutoTileMapChip } from '@piyoppi/pico2map-tiled'
import { Project } from './Projects'
import { Pen } from './Brushes/Pen'
import { Brushes } from './Brushes/Brushes'
import { Arrangements } from './Brushes/Arrangements/Arrangements'
import { Brush } from './Brushes/Brush'
import { Arrangement, isMapChipFragmentRequired, isTiledMapDataRequired, isAutoTileRequired, isAutoTilesRequired } from './Brushes/Arrangements/Arrangement'
import { DefaultArrangement } from './Brushes/Arrangements/DefaultArrangement'
import { EditorCanvas } from './EditorCanvas'
import { MapChipPicker } from './MapChipPicker'
import { convertFromCursorPositionToChipPosition } from './CursorPositionConverter'

type PickedCallbackFn = (picked: TiledMapDataItem) => void

export class MapCanvas implements EditorCanvas {
  private _secondaryCanvasCtx: CanvasRenderingContext2D | null = null
  private _isMouseDown = false
  private _brush: Brush<TiledMapDataItem> = new Pen()
  private _arrangement: Arrangement<TiledMapDataItem> = new DefaultArrangement()
  private _lastMapChipPosition = {x: -1, y: -1}
  private _renderer: MapRenderer | null = null
  private _canvases: Array<HTMLCanvasElement> = []
  private _canvasContexts: Array<CanvasRenderingContext2D> = []
  private secondaryCanvas: HTMLCanvasElement | null = null
  private _project: Project | null = null
  private _selectedAutoTile: AutoTile | null = null
  private _selectedMapChipFragments: Array<MapChipFragment> = []
  private _activeLayerIndex: number = 0
  private _mapChipPickerEnabled = true
  private _mapChipPicker: MapChipPicker | null = null
  private _pickedCallback: PickedCallbackFn | null = null

  constructor(
  ) {
  }

  get selectedAutoTile() {
    return this._selectedAutoTile
  }

  get selectedMapChipFragments() {
    return this._selectedMapChipFragments
  }

  get project() {
    if (!this._project) throw new Error('Project is not set')
    return this._project
  }

  get renderer() {
    if (!this._renderer) throw new Error('Renderer is not set')
    return this._renderer
  }

  get activeLayer() {
    return this._activeLayerIndex
  }

  get isMouseDown() {
    return this._isMouseDown
  }

  get renderable() {
    return this._canvasContexts.length > 0 && !!this._renderer
  }

  get mapChipPickerEnabled() {
    return this._mapChipPickerEnabled
  }

  hasActiveAutoTile() {
    return !!this._selectedAutoTile
  }

  async setProject(project: Project) {
    this._project = project
    this._renderer = new MapRenderer(this._project.tiledMap)
    this._mapChipPicker = new MapChipPicker(this._project.tiledMap)

    this._project.registerRenderAllCallback(() => this.renderAll())

    await this._project.tiledMap.mapChipsCollection.waitWhileLoading()

    if (this.renderable) {
      this.renderAll()
    }
  }

  renderAll() {
    if (!this.renderable) return
    const renderer = this.renderer
    this._canvasContexts.forEach((ctx, index) => renderer.renderLayer(index, ctx))
  }

  setCanvases(canvases: Array<HTMLCanvasElement>, secondaryCanvas: HTMLCanvasElement) {
    this._canvases = canvases
    this._canvasContexts = this._canvases.map(canvas => canvas.getContext('2d') as CanvasRenderingContext2D)
    this.secondaryCanvas = secondaryCanvas
    this._secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D

    if (this.renderable) {
      this.renderAll()
    }
  }

  addCanvas(canvas: HTMLCanvasElement) {
    this._canvases.push(canvas)
    this._canvasContexts.push(canvas.getContext('2d') as CanvasRenderingContext2D)
  }

  setAutoTile(value: AutoTile) {
    this._selectedAutoTile = value
  }

  setMapChipFragments(value: Array<MapChipFragment>) {
    this._selectedMapChipFragments = value
  }

  setPickedCallback(callbackFn: PickedCallbackFn) {
    this._pickedCallback = callbackFn
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

  setActiveLayer(index: number) {
    if (!this._project) return

    if (index < 0 || index >= this._project.tiledMap.datas.length) {
      throw new Error('The layer index is out of range.')
    }

    this._activeLayerIndex = index
  }

  setMapChipPickerEnabled(value: boolean) {
    this._mapChipPickerEnabled = value
  }

  private _setupBrush() {
    if (!this._project || !this._arrangement) return

    this._brush.setArrangement(this._arrangement)

    if (isTiledMapDataRequired(this._arrangement)) {
      this._arrangement.setTiledMapData(this._project.tiledMap.datas[this._activeLayerIndex])
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

  mouseDown(x: number, y: number, isSubButton = false) {
    const chipPosition = this.convertFromCursorPositionToChipPosition(x, y)

    if (isSubButton && this._mapChipPickerEnabled) {
      this.pick(chipPosition.x, chipPosition.y)

      return
    }

    if (isMapChipFragmentRequired(this._arrangement) && !isAutoTileRequired(this._arrangement) && this._selectedMapChipFragments.length < 1) return
    if (isAutoTileRequired(this._arrangement) && !this.selectedAutoTile) return

    this._isMouseDown = true

    if (isMapChipFragmentRequired(this._arrangement)) {
      this._arrangement.setMapChips(this._selectedMapChipFragments)
    }

    if (isAutoTileRequired(this._arrangement) && this._selectedAutoTile) {
      this._arrangement.setAutoTile(this._selectedAutoTile)
    }

    if (isAutoTilesRequired(this._arrangement)) {
      this._arrangement.setAutoTiles(this.project.tiledMap.autoTiles)
    }

    this._brush.mouseDown(chipPosition.x, chipPosition.y)

    this._lastMapChipPosition = chipPosition

    this._paint(chipPosition)
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
    if (!this._isMouseDown) return

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
    this.project.tiledMap.put(mapChip, chipX, chipY, this._activeLayerIndex)
    this.renderer.putOrClearChipToCanvas(this._canvasContexts[this._activeLayerIndex], mapChip, chipX, chipY)
  }

  private _paint(chipPosition: {x: number, y: number}) {
    this.clearSecondaryCanvas()
    this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
      if (!this._secondaryCanvasCtx) return

      const chip = paint.item
      this.renderer.putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true)
    })
  }

  private clearSecondaryCanvas() {
    if (!this.secondaryCanvas || !this._secondaryCanvasCtx) return

    this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height)
  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return convertFromCursorPositionToChipPosition(x, y, this.project.tiledMap.chipWidth, this.project.tiledMap.chipHeight, this.project.tiledMap.chipCountX, this.project.tiledMap.chipCountY)
  }

  private pick(x: number, y: number) {
    const picked = this._mapChipPicker?.pick(x, y) || null

    if (isAutoTileMapChip(picked)) {
      const autoTile = this.project.tiledMap.autoTiles.fromId(picked.autoTileId)
      if (autoTile) this.setAutoTile(autoTile)
    } else if (picked) {
      this.setMapChipFragments(picked.items)
    }

    if (this._pickedCallback) this._pickedCallback(picked)
  }
}
