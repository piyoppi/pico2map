/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

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
import { convertFromCursorPositionToChipPosition, convertChipPositionDivisionByCursorSize } from './CursorPositionConverter'
import { CallbackItem } from './CallbackItem'

type PickedCallbackFn = (picked: TiledMapDataItem) => void

export class MapCanvas implements EditorCanvas {
  private _secondaryCanvasCtx: CanvasRenderingContext2D | null = null
  private _isMouseDown = false
  private _brush: Brush<TiledMapDataItem> = new Pen()
  private _arrangement: Arrangement<TiledMapDataItem> = new DefaultArrangement()
  private _lastMapChipPosition = {x: -1, y: -1}
  private _mapMouseDownPosition = {x: -1, y: -1}
  private _canvasContexts: Array<CanvasRenderingContext2D> = []
  private secondaryCanvas: HTMLCanvasElement | null = null
  private _project: Project | null = null
  private _renderer: MapRenderer | null = null
  private _selectedAutoTile: AutoTile | null = null
  private _selectedMapChipFragments: Array<MapChipFragment> = []
  private _selectedMapChipFragmentBoundarySize = {width: 0, height: 0}
  private _activeLayerIndex: number = 0
  private _mapChipPickerEnabled = true
  private _mapChipPicker: MapChipPicker | null = null
  private _isPickFromActiveLayer = false
  private _pickedCallback: PickedCallbackFn | null = null
  private _renderAllCallbackItem: CallbackItem | null = null

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

  get hasProject() {
    return !!this._project
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

  get isPickFromActiveLayer() {
    return this._isPickFromActiveLayer
  }

  get selectedMapChipFragmentBoundarySize() {
    return this._selectedMapChipFragmentBoundarySize
  }

  set isPickFromActiveLayer(value) {
    this._isPickFromActiveLayer = value
  }

  get isSubscribedProjectEvent() {
    return !!this._renderAllCallbackItem
  }

  hasActiveAutoTile() {
    return !!this._selectedAutoTile
  }

  setProject(project: Project) {
    if (this._project === project) throw new Error('This project has already been set.')
    if (this.isSubscribedProjectEvent) throw new Error('This map-canvas is subscribed to the project event. You need to unsubscribe.')

    this._project = project
    this._renderer = new MapRenderer(this._project.tiledMap)
    this._mapChipPicker = new MapChipPicker(this._project.tiledMap)
    this._setupBrush()
  }

  subscribeProjectEvent() {
    if (this._renderAllCallbackItem) throw new Error('Project Event is already subscribed')
    if (!this._project) throw new Error('Project is not set')

    this._renderAllCallbackItem = this._project.setCallback('renderAll', () => this.renderAll())
  }

  unsubscribeProjectEvent() {
    if (this._project && this._renderAllCallbackItem) this._project.removeCallback('renderAll', this._renderAllCallbackItem)

    this._renderAllCallbackItem = null
  }

  async firstRenderAll() {
    if (!this._project) return

    await this._project.tiledMap.mapChipsCollection.waitWhileLoading()

    if (this.renderable) {
      this.renderAll()
    }
  }

  renderAll() {
    if (!this.renderable) return
    const renderer = this.renderer
    this._canvasContexts.forEach((ctx, index) => (this.project.tiledMap.datas.length > index) && renderer.renderLayer(index, ctx))
  }

  setCanvases(canvases: Array<HTMLCanvasElement>, secondaryCanvas: HTMLCanvasElement) {
    this._canvasContexts = canvases.map(canvas => canvas.getContext('2d') as CanvasRenderingContext2D)
    this.secondaryCanvas = secondaryCanvas
    this._secondaryCanvasCtx = this.secondaryCanvas.getContext('2d') as CanvasRenderingContext2D

    if (this.renderable) {
      this.renderAll()
    }
  }

  addCanvas(canvas: HTMLCanvasElement) {
    this._canvasContexts.push(canvas.getContext('2d') as CanvasRenderingContext2D)
  }

  setAutoTile(value: AutoTile) {
    this._selectedAutoTile = value
    this._selectedMapChipFragmentBoundarySize = {width: 1, height: 1}
  }

  setMapChipFragments(value: Array<MapChipFragment>) {
    this._selectedMapChipFragments = value

    const boundary = value
      .reduce((acc, val) => ({x1: Math.min(acc.x1, val.x), y1: Math.min(acc.y1, val.y), x2: Math.max(acc.x2, val.x), y2: Math.max(acc.y2, val.y)}), {x1: value[0].x, y1: value[0].y, x2: value[0].x, y2: value[0].y})
    this._selectedMapChipFragmentBoundarySize = {width: boundary.x2 - boundary.x1 + 1, height: boundary.y2 - boundary.y1 + 1}
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

    this._setupBrush()
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

    this._mapMouseDownPosition = this._lastMapChipPosition = chipPosition

    this._paint(chipPosition)
  }

  mouseMove(x: number, y: number): {x: number, y: number} {
    const cursorPosition = this.convertFromCursorPositionToChipPosition(x, y)
    const chipPosition = convertChipPositionDivisionByCursorSize(
      cursorPosition.x,
      cursorPosition.y,
      this._mapMouseDownPosition.x,
      this._mapMouseDownPosition.y,
      this._selectedMapChipFragmentBoundarySize.width,
      this._selectedMapChipFragmentBoundarySize.height
    )

    if (!this._isMouseDown) return chipPosition
    if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y) return chipPosition

    this._paint(chipPosition)

    this._lastMapChipPosition = chipPosition

    return chipPosition
  }

  mouseUp() {
    if (!this._isMouseDown) return

    const chipPosition = this._lastMapChipPosition;

    this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
      const chip = paint.item
      this.putChip(chip, paint.x, paint.y)
    })

    this.reset()
  }

  reset() {
    if (!this._isMouseDown) return

    this._isMouseDown = false

    this.clearSecondaryCanvas()
    this._brush.cleanUp()
    this._mapMouseDownPosition = this._lastMapChipPosition = {x: -1, y: -1}
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
    return convertFromCursorPositionToChipPosition(
      x,
      y,
      this.project.tiledMap.chipWidth,
      this.project.tiledMap.chipHeight,
      this.project.tiledMap.chipCountX,
      this.project.tiledMap.chipCountY,
      this._selectedMapChipFragmentBoundarySize.width,
      this._selectedMapChipFragmentBoundarySize.height
    )
  }

  private pick(x: number, y: number) {
    if (!this._mapChipPicker) return;
    const picked = this._isPickFromActiveLayer ? this._mapChipPicker?.pick(x, y, this._activeLayerIndex) : this._mapChipPicker?.pick(x, y)

    if (isAutoTileMapChip(picked)) {
      const autoTile = this.project.tiledMap.autoTiles.fromId(picked.autoTileId)
      if (autoTile) this.setAutoTile(autoTile)
    } else if (picked) {
      this.setMapChipFragments(picked.items)
    }

    if (this._pickedCallback) this._pickedCallback(picked)
  }
}
