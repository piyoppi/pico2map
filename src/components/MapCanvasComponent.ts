import { LitElement, html, css, customElement, property } from 'lit-element'
import { GridImageGenerator } from '../GridImageGenerator'
import { CursorPositionCalculator } from './helpers/CursorPositionCalculator'
import { MapCanvas } from './../MapCanvas'
import { Projects, Project } from './../Projects'

@customElement('map-canvas-component')
export class MapCanvasComponent extends LitElement {
  private gridImageSrc = ''
  private gridImageGenerator: GridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _mapCanvas: MapCanvas | null = null
  private _project: Project | null = null
  private _canvas: HTMLCanvasElement | null = null
  private _secondaryCanvas: HTMLCanvasElement | null = null

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

  private setupMapCanvas() {
    if (!this._project || !this._canvas || !this._secondaryCanvas) return;

    if (!this._mapCanvas) {
      this._mapCanvas = new MapCanvas(this._project, this._canvas, this._secondaryCanvas)
    }

    this._mapCanvas.setBrushFromName(this._brushName)
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)

    this._canvas = this.shadowRoot?.getElementById('map-canvas') as HTMLCanvasElement
    this._secondaryCanvas = this.shadowRoot?.getElementById('secondary-canvas') as HTMLCanvasElement
    this.setupMapCanvas()
  }

  mouseMove(e: MouseEvent) {
    if (!this._mapCanvas) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const cursor = this._mapCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y)
    this.cursorChipX = cursor.x
    this.cursorChipY = cursor.y
  }

  mouseDown(e: MouseEvent) {
    if (!this._mapCanvas || !this._project) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._mapCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y)
  }

  mouseUp(e: MouseEvent) {
    if (!this._mapCanvas || !this._project) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._mapCanvas.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y)
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
          width: ${this.width}px;
          height: ${this.height}px;
        }

        .cursor {
          width: ${this.gridWidth}px;
          height: ${this.gridHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }
      </style>

      <div id="boundary">
        <div
          class="grid-image grid"
          @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          @mouseup ="${(e: MouseEvent) => this.mouseUp(e)}"
        ></div>
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

      #secondary-canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `
  }
}
