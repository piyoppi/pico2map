import { LitElement, html, css, customElement, property } from 'lit-element'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'
import { GridImageGenerator, MapCanvas, Projects, Project, ColiderCanvas, EditorCanvas } from '@piyoppi/pico2map-editor'
import { MapChipFragment, MapChipFragmentProperties, ColiderTypes } from '@piyoppi/pico2map-tiled'

type EditMode = 'mapChip' | 'colider'

export class MapCanvasComponent extends LitElement {
  private gridImageSrc = ''
  private gridImageGenerator: GridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _mapCanvas = new MapCanvas()
  private _coliderCanvas = new ColiderCanvas()
  private _project: Project | null = null
  private _secondaryCanvasElement: HTMLCanvasElement | null = null
  private _coliderCanvasElement : HTMLCanvasElement | null = null
  private _canvasesOuterElement : HTMLCanvasElement | null = null
  private _mode: EditMode = 'mapChip'
  private _autoTileIdAttributeValue: number = -1
  private _inactiveLayerOpacity = 1.0

  constructor() {
    super()

    Projects.setProjectAddCallbackFunction(() => this.setupProject())
  }

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0

  @property({type: String})
  get gridColor(): string {
    return this.gridImageGenerator.gridColor
  }
  set gridColor(value: string) {
    const oldValue = this.gridImageGenerator.gridColor
    this.gridImageGenerator.gridColor = value

    this.requestUpdate('gridColor', oldValue)
  }

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

    this.setupProject(true)

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

    this.setupMapCanvas()

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

    this.setupMapCanvas()

    this.requestUpdate('arrangement', oldValue);
  }

  @property({type: String})
  get mode() {
    return this._mode
  }
  set mode(value: EditMode) {
    const oldValue = this._mode
    this._mode = value

    this.requestUpdate('mode', oldValue);
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

  @property({type: String})
  get coliderType() {
    return this._coliderCanvas.selectedColiderType || ''
  }
  set coliderType(value: ColiderTypes | '') {
    const oldValue = value
    this.requestUpdate('coliderType', oldValue);

    if (!value) return
    this._coliderCanvas.setColiderType(value)
  }

  @property({type: Number})
  get activeLayer() {
    return this._mapCanvas.activeLayer
  }
  set activeLayer(value: number) {
    this._mapCanvas.setActiveLayer(value)
    this.setInactiveCanvasStyle()
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

  get cursorPosition() {
    return {
      x: this.cursorChipX * this.gridWidth,
      y: this.cursorChipY * this.gridHeight
    }
  }

  get currentEditorCanvas(): EditorCanvas {
    switch (this._mode) {
      case 'colider':
        return this._coliderCanvas
      default:
        return this._mapCanvas
    }
  }

  private setupProject(forced: boolean = false) {
    if (!this._project || forced) {
      this._project = Projects.fromProjectId(this._projectId)
      if (!this._project) return
      this.setupMapCanvas()
      this.setActiveAutoTile()
      this.requestUpdate()
      this._project.addBeforeAddLayerCallback(() => this._mapCanvas.addCanvas(this.addCanvasToDOMTree()))
    }
  }

  private createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    return canvas
  }

  private addCanvasToDOMTree(): HTMLCanvasElement {
    if (!this._canvasesOuterElement) throw new Error()
    const canvas = this.createCanvas()
    this._canvasesOuterElement.appendChild(canvas)
    return canvas
  }

  private _createCanvases(): Array<HTMLCanvasElement> {
    if (!this._project || !this._canvasesOuterElement) throw new Error()

    return this._project.tiledMap.datas.map(_ => this.addCanvasToDOMTree())
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
    if (!this._project || !this._secondaryCanvasElement || !this._coliderCanvasElement || !this._canvasesOuterElement) return

    this._mapCanvas.setProject(this._project)
    if (this._canvasesOuterElement.childNodes.length === 0) {
      this._mapCanvas.setCanvases(this._createCanvases(), this._secondaryCanvasElement)
    }

    this._coliderCanvas.setProject(this._project)
    this._coliderCanvas.setCanvas(this._coliderCanvasElement, this._secondaryCanvasElement)

    this._mapCanvas.setBrushFromName(this._brushName)
    this._mapCanvas.setArrangementFromName(this._arrangementName)
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
    this._coliderCanvasElement = this.shadowRoot?.getElementById('colider-canvas') as HTMLCanvasElement
    this._canvasesOuterElement = this.shadowRoot?.getElementById('canvases') as HTMLCanvasElement
    this.setupMapCanvas()
  }

  mouseMove(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const cursor = this.currentEditorCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y)
    this.cursorChipX = cursor.x
    this.cursorChipY = cursor.y
  }

  mouseDown(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.currentEditorCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y)
  }

  mouseUp(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.currentEditorCanvas.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y)
  }

  render() {
    this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight)
    if (this.gridImageGenerator.changed) {
      this.gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL()
    }

    return html`
      <style>
        .grid {
          background-image: url("${this.gridImageSrc}");
        }

        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }

        .cursor {
          width: ${this.gridWidth}px;
          height: ${this.gridHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .grid-image {
          background-position: 1px 1px
        }
      </style>

      <div id="boundary">
        <canvas
          id="colider-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        <div id="canvases"></div>
        <canvas
          id="secondary-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        <div
          class="grid-image grid"
          @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          @mouseup ="${(e: MouseEvent) => this.mouseUp(e)}"
        ></div>
        <div class="cursor"></div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
        width: 100%;
        height: 100%;
      }

      .cursor {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
        border-color: red;
        pointer-events: none;
      }

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

      #secondary-canvas, #colider-canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `
  }
}
