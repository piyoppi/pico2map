import { LitElement, html, css, customElement, property } from 'lit-element'
import { GridImageGenerator } from '../GridImageGenerator'
import { CursorPositionCalculator } from './helpers/CursorPositionCalculator'
import { MapCanvas } from './../MapCanvas'
import { Projects, Project } from './../Projects'
import { ColiderCanvas } from '../ColiderCanvas'
import { EditorCanvas } from '../EditorCanvas'
import { TiledMap, MapChipFragment, MapChipFragmentProperties, ColiderTypes } from '@piyoppi/tiled-map'

type EditMode = 'mapChip' | 'colider'

@customElement('map-canvas-component')
export class MapCanvasComponent extends LitElement {
  private gridImageSrc = ''
  private gridImageGenerator: GridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _mapCanvas = new MapCanvas()
  private _coliderCanvas = new ColiderCanvas()
  private _project: Project | null = null
  private _canvasElement: HTMLCanvasElement | null = null
  private _secondaryCanvasElement: HTMLCanvasElement | null = null
  private _coliderCanvasElement : HTMLCanvasElement | null = null
  private _mode: EditMode = 'mapChip'
  private _autoTileIdAttributeValue: number = -1

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0

  private _projectId = -1
  @property({type: Number})
  get projectId(): number {
    return this._projectId
  }
  set projectId(value: number) {
    const oldValue = this._projectId
    this._projectId = value

    this._project = Projects.fromProjectId(value)

    this.setupMapCanvas()
    this.setActiveAutoTile()

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
    return this._mapCanvas.selectedMapChipFragment?.toObject() || null
  }
  set mapChipFragmentProperties(value: MapChipFragmentProperties | null) {
    const oldValue = value
    this.requestUpdate('mapChipFragmentProperties', oldValue);

    if (!value) return

    const mapChipFragment = MapChipFragment.fromObject(value)
    this._mapCanvas.setMapChipFragment(mapChipFragment)
  }

  @property({type: String})
  get coliderType() {
    return this._coliderCanvas.selectedColiderType || ''
  }
  set coliderType(value: ColiderTypes | '') {
    const oldValue = value
    this.requestUpdate('mapChipFragmentProperties', oldValue);

    if (!value) return
    this._coliderCanvas.setColiderType(value)
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

  private setActiveAutoTile(forced: boolean = false) {
    if (!this._project || this._autoTileIdAttributeValue < 0) return

    if (!this._mapCanvas.hasActiveAutoTile() || forced) {
      const autoTile = this._project.tiledMap.autoTiles.fromId(this._autoTileIdAttributeValue)
      console.log(autoTile)
      if (!autoTile) throw new Error(`AutoTile (id: ${this._autoTileIdAttributeValue}) is not found.`)
      this._mapCanvas.setAutoTile(autoTile)
    }
  }

  private setupMapCanvas() {
    if (!this._project || !this._canvasElement || !this._secondaryCanvasElement || !this._coliderCanvasElement) return;

    this._mapCanvas.setProject(this._project)
    this._mapCanvas.setCanvas(this._canvasElement, this._secondaryCanvasElement)

    this._coliderCanvas.setProject(this._project)
    this._coliderCanvas.setCanvas(this._coliderCanvasElement, this._secondaryCanvasElement)

    this._mapCanvas.setBrushFromName(this._brushName)
    this._mapCanvas.setArrangementFromName(this._arrangementName)
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)

    this._canvasElement = this.shadowRoot?.getElementById('map-canvas') as HTMLCanvasElement
    this._secondaryCanvasElement = this.shadowRoot?.getElementById('secondary-canvas') as HTMLCanvasElement
    this._coliderCanvasElement = this.shadowRoot?.getElementById('colider-canvas') as HTMLCanvasElement
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
    this.gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL()

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
        <canvas
          id="map-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
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
