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

    if (!this._project) return;

    this._project.mapChipSelector.setChipSize(this.gridWidth, this.gridHeight)
    this._mapCanvas = new MapCanvas(this._project.tiledMap)

    this.requestUpdate('projectId', oldValue);
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

  updated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)
  }

  mouseMove(e: MouseEvent) {
    if (!this._mapCanvas) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const chipPosition = this._mapCanvas.convertFromCursorPositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)
    this.cursorChipX = chipPosition.x
    this.cursorChipY = chipPosition.y
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
        ></div>
        <canvas
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
    `
  }
}
