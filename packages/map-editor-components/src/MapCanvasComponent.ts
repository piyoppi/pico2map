import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'
import { MapCanvas, Projects, Project, CallbackItem } from '@piyoppi/pico2map-editor'
import { MapChipFragment, MapChipFragmentProperties } from '@piyoppi/pico2map-tiled'

export class MapCanvasComponent extends LitElement {
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _mapCanvas = new MapCanvas()
  private _project: Project | null = null
  private _secondaryCanvasElement: HTMLCanvasElement | null = null
  private _canvasesOuterElement : HTMLCanvasElement | null = null
  private _autoTileIdAttributeValue: number = -1
  private _inactiveLayerOpacity = 1.0
  private _appendedLayerCanvases: Array<HTMLCanvasElement> = []
  private _canvasMaxIds = 1
  private _beforeAddLayerCallbackItem: CallbackItem | null = null
  private _afterResizedMapCallbackItem: CallbackItem | null = null

  private _documentMouseMoveEventCallee: ((e: MouseEvent) => void) | null = null
  private _documentMouseUpEventCallee: ((e: MouseEvent) => void) | null = null

  constructor() {
    super()

    Projects.setProjectAddCallbackFunction(() => this.setupProject())

    this._mapCanvas.setPickedCallback((picked => {
      this.dispatchEvent(
        new CustomEvent('mapchip-picked', {
          detail: {picked},
          bubbles: true,
          composed: true
        })
      )
    }))
  }

  @property({type: Boolean}) gridCursorHidden = false
  @property({type: Boolean}) preventDefaultContextMenu = true
  @property({type: String}) gridColor = '#000'

  @property({type: Number})
  get inactiveLayerOpacity(): number {
    return this._inactiveLayerOpacity
  }
  set inactiveLayerOpacity(value: number) {
    const oldValue = this._inactiveLayerOpacity
    this._inactiveLayerOpacity = value

    this.setInactiveCanvasStyle()

    this.requestUpdate('inactiveLayerOpacity', oldValue);
  }

  private _projectId = -1
  @property({type: Number})
  get projectId(): number {
    return this._projectId
  }
  set projectId(value: number) {
    const oldValue = this._projectId
    this._projectId = value

    this.setupProject()

    this.requestUpdate('projectId', oldValue);
  }

  private _brushName = ''
  @property({type: String})
  get brush() {
    return this._brushName
  }
  set brush(value: string) {
    const oldValue = this._brushName
    this._brushName = value

    this._mapCanvas.setBrushFromName(this._brushName)

    this.requestUpdate('brush', oldValue);
  }

  private _arrangementName = ''
  @property({type: String})
  get arrangement() {
    return this._arrangementName
  }
  set arrangement(value: string) {
    const oldValue = this._arrangementName
    this._arrangementName = value

    this._mapCanvas.setArrangementFromName(this._arrangementName)

    this.requestUpdate('arrangement', oldValue);
  }

  @property({type: Number})
  get autoTileId() {
    return this._mapCanvas.selectedAutoTile?.id || -1
  }
  set autoTileId(value: number) {
    const oldValue = value
    const autoTile = this._project?.tiledMap.autoTiles.fromId(value)

    this._autoTileIdAttributeValue = value
    this.setActiveAutoTile(true)

    this.requestUpdate('autoTileId', oldValue);
  }

  @property({type: Object})
  get mapChipFragmentProperties() {
    return this._mapCanvas.selectedMapChipFragments?.map(mapChipFragment => mapChipFragment.toObject()) || null
  }
  set mapChipFragmentProperties(values: Array<MapChipFragmentProperties> | null) {
    const oldValue = values

    this.requestUpdate('mapChipFragmentProperties', oldValue);

    if (!values) return

    const mapChipFragments = values.map(value => MapChipFragment.fromObject(value))
    this._mapCanvas.setMapChipFragments(mapChipFragments)
  }

  @property({type: Number})
  get activeLayer() {
    return this._mapCanvas.activeLayer
  }
  set activeLayer(value: number) {
    this._mapCanvas.setActiveLayer(value)
    this.setInactiveCanvasStyle()
  }

  @property({type: Boolean})
  get pickFromActiveLayer() {
    return this._mapCanvas.isPickFromActiveLayer
  }
  set pickFromActiveLayer(value: boolean) {
    this._mapCanvas.isPickFromActiveLayer = value
  }

  private get width() {
    return this.xCount * this.gridWidth
  }

  private get height() {
    return this.yCount * this.gridHeight
  }

  get xCount() {
    return this._project?.tiledMap.chipCountX || 0
  }

  get yCount() {
    return this._project?.tiledMap.chipCountY || 0
  }

  get gridWidth() {
    return this._project?.tiledMap.chipWidth || 0 
  }

  get gridHeight() {
    return this._project?.tiledMap.chipHeight || 0 
  }

  get mapCanvas() {
    return this._mapCanvas
  }

  get isSubscribedProjectEvent() {
    return !!this._beforeAddLayerCallbackItem && !!this._afterResizedMapCallbackItem
  }

  set mapCanvas(value: MapCanvas) {
    this._mapCanvas = value
  }

  private setupProject() {
    if (this._project && this._project.projectId === this._projectId) return

    if (this._project) {
      this._mapCanvas.unsubscribeProjectEvent()
      this._unsubscribeProjectEvent()
    }

    this._project = Projects.fromProjectId(this._projectId)
    if (!this._project) return

    this._mapCanvas.setProject(this._project)

    if (!this._mapCanvas.isSubscribedProjectEvent) this._mapCanvas.subscribeProjectEvent()
    if (!this.isSubscribedProjectEvent) this._subscribeProjectEvent()

    this._mapCanvas.firstRenderAll()
    this.setupMapCanvas()
    this.setActiveAutoTile()

    this.requestUpdate()
  }

  private _subscribeProjectEvent() {
    if (!this._project || this.isSubscribedProjectEvent) return

    this._beforeAddLayerCallbackItem = this._project.setCallback('beforeAddLayer', () => this._mapCanvas.addCanvas(this.addCanvasToDOMTree()))
    this._afterResizedMapCallbackItem = this._project.setCallback('afterResizedMap', () => {
      this.requestUpdate()
      this._appendedLayerCanvases.forEach(canvas => {
        canvas.width = this.width
        canvas.height = this.height
      })
      this._mapCanvas.renderAll()
    })
  }

  private _unsubscribeProjectEvent() {
    if (!this._project) return

    if (this._beforeAddLayerCallbackItem) this._project.removeCallback('beforeAddLayer', this._beforeAddLayerCallbackItem)
    if (this._afterResizedMapCallbackItem) this._project.removeCallback('afterResizedMap', this._afterResizedMapCallbackItem)

    this._beforeAddLayerCallbackItem = null
    this._afterResizedMapCallbackItem = null
  }

  private createCanvas() {
    const canvas = document.createElement('canvas')
    this.setupCanvas(canvas)
    canvas.width = this.width
    canvas.height = this.height
    return canvas
  }

  private setupCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, this.width, this.height)
  }

  private addCanvasToDOMTree(): HTMLCanvasElement {
    if (!this._canvasesOuterElement) throw new Error()

    const canvas = this.createCanvas()
    canvas.id = `layer_canvas_${this._canvasMaxIds++}`
    this._canvasesOuterElement.appendChild(canvas)
    this._appendedLayerCanvases.push(canvas)

    return canvas
  }

  private removeCanvasToDOMTree(index: number) {
    if (!this._canvasesOuterElement) throw new Error()

    const canvas = this._appendedLayerCanvases[index]
    this._canvasesOuterElement.removeChild(canvas)
    this._appendedLayerCanvases.splice(index, 1)
  }

  private setActiveAutoTile(forced: boolean = false) {
    if (!this._project || this._autoTileIdAttributeValue < 0) return

    if (!this._mapCanvas.hasActiveAutoTile() || forced) {
      const autoTile = this._project.tiledMap.autoTiles.fromId(this._autoTileIdAttributeValue)
      if (!autoTile) throw new Error(`AutoTile (id: ${this._autoTileIdAttributeValue}) is not found.`)
      this._mapCanvas.setAutoTile(autoTile)
    }
  }

  private setupMapCanvas() {
    if (!this._project || !this._secondaryCanvasElement || !this._canvasesOuterElement) return

    const diffCanvasCount = this._project.tiledMap.datas.length - this._appendedLayerCanvases.length

    this._appendedLayerCanvases.forEach(canvas => this.setupCanvas(canvas))

    if (diffCanvasCount > 0) {
      for (let i = 0; i < diffCanvasCount; i++) {
        this.addCanvasToDOMTree()
      }
    } else if (diffCanvasCount < 0) {
      const layerCanvasesLength = this._appendedLayerCanvases.length
      for (let i = layerCanvasesLength - 1; i >= layerCanvasesLength + diffCanvasCount; i--) {
        this.removeCanvasToDOMTree(i)
      }
    }

    this._mapCanvas.setCanvases(this._appendedLayerCanvases, this._secondaryCanvasElement)
  }

  private setInactiveCanvasStyle() {
    if (!this._canvasesOuterElement) return

    this._canvasesOuterElement.childNodes.forEach((node, index) => {
      const element = node as HTMLElement

      if (this.activeLayer === index) {
        element.style.opacity = '1.0'
      } else {
        element.style.opacity = this._inactiveLayerOpacity.toString()
      }
    })
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)

    this._secondaryCanvasElement = this.shadowRoot?.getElementById('secondary-canvas') as HTMLCanvasElement
    this._canvasesOuterElement = this.shadowRoot?.getElementById('canvases') as HTMLCanvasElement
    this.setupMapCanvas()
  }

  mouseMove(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._mapCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y)
  }

  mouseDown(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._mapCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y, e.button === 2)

    this._documentMouseMoveEventCallee = e => this.mouseMove(e)
    this._documentMouseUpEventCallee = e => this.mouseUp(e)

    document.addEventListener('mousemove', this._documentMouseMoveEventCallee)
    document.addEventListener('mouseup', this._documentMouseUpEventCallee)
  }

  mouseUp(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._mapCanvas.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y)

    if (this._documentMouseMoveEventCallee) document.removeEventListener('mousemove', this._documentMouseMoveEventCallee)
    if (this._documentMouseUpEventCallee) document.removeEventListener('mouseup', this._documentMouseUpEventCallee)

    this._documentMouseMoveEventCallee = null
    this._documentMouseUpEventCallee = null
  }

  render() {
    return html`
      <style>
        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }
      </style>

      <div id="boundary"
        @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
        @mousemove="${(e: MouseEvent) => !this._mapCanvas.isMouseDown ? this.mouseMove(e) : null}"
        @contextmenu="${(e: MouseEvent) => this.preventDefaultContextMenu && e.preventDefault()}"
      >
        <div id="canvases"></div>
        <canvas
          id="secondary-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        ${
          this.gridCursorHidden ? null : html`
          <map-grid-component
            gridWidth="${this.gridWidth}"
            gridHeight="${this.gridHeight}"
            chipCountX="${this.xCount}"
            chipCountY="${this.yCount}"
            gridColor="${this.gridColor}"
          ></map-grid-component>`
        }
      </div>
    `
  }

  static get styles() {
    return css`
      #canvases {
        position: relative;
      }

      #canvases > canvas {
        position: absolute;
        top: 0;
        left: 0;
      }

      #boundary {
        position: relative;
      }

      #secondary-canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._mapCanvas.unsubscribeProjectEvent()
    this._unsubscribeProjectEvent()
  }

  connectedCallback() {
    super.connectedCallback()

    if (this._mapCanvas.hasProject && !this._mapCanvas.isSubscribedProjectEvent) this._mapCanvas.subscribeProjectEvent()
    if (this._project && !this.isSubscribedProjectEvent) this._subscribeProjectEvent()
  }
}
