import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'
import { GridImageGenerator, Projects, Project, ColiderCanvas } from '@piyoppi/pico2map-editor'
import { ColiderTypes } from '@piyoppi/pico2map-tiled-colision-detector'

export class ColiderMarkerComponent extends LitElement {
  private _gridImageSrc = ''
  private _gridImageGenerator: GridImageGenerator = new GridImageGenerator()
  private _cursorPositionCalculator = new CursorPositionCalculator()
  private _coliderCanvas = new ColiderCanvas()
  private _project: Project | null = null
  private _coliderCanvasElement : HTMLCanvasElement | null = null
  private _secondaryCanvasElement : HTMLCanvasElement | null = null

  private _documentMouseMoveEventCallee: ((e: MouseEvent) => void) | null = null
  private _documentMouseUpEventCallee: ((e: MouseEvent) => void) | null = null

  constructor() {
    super()

    Projects.setProjectAddCallbackFunction(() => this.setupProject())
  }

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0
  @property({type: Boolean}) preventDefaultContextMenu = true

  @property({type: String})
  get gridColor(): string {
    return this._gridImageGenerator.gridColor
  }
  set gridColor(value: string) {
    const oldValue = this._gridImageGenerator.gridColor
    this._gridImageGenerator.gridColor = value

    this.requestUpdate('gridColor', oldValue)
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

    this._coliderCanvas.setBrushFromName(this._brushName)

    this.requestUpdate('brush', oldValue);
  }

  @property({type: Number})
  get coliderType() {
    return this._coliderCanvas.selectedColiderType
  }
  set coliderType(value: ColiderTypes) {
    const oldValue = value
    this.requestUpdate('coliderType', oldValue);

    this._coliderCanvas.setColiderType(value)
  }

  @property({type: Number})
  get subColiderType() {
    return this._coliderCanvas.selectedSubColiderType
  }
  set subColiderType(value: ColiderTypes) {
    const oldValue = value
    this.requestUpdate('subColiderType', oldValue);

    this._coliderCanvas.setSubColiderType(value)
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

  get coliderCanvas() {
    return this._coliderCanvas
  }

  private setupProject() {
    if (this._project && this._project.projectId === this._projectId) return

    if (this._project) {
      this._coliderCanvas.unsubscribeProjectEvent()
    }

    this._project = Projects.fromProjectId(this._projectId)
    if (!this._project) return

    this._coliderCanvas.setProject(this._project)
    if (!this._coliderCanvas.isSubscribedProjectEvent) this._coliderCanvas.subscribeProjectEvent()

    this.requestUpdate()
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this._cursorPositionCalculator.setElement(element)

    this._coliderCanvasElement = this.shadowRoot?.getElementById('colider-canvas') as HTMLCanvasElement
    this._secondaryCanvasElement = this.shadowRoot?.getElementById('secondary-canvas') as HTMLCanvasElement

    if (this._secondaryCanvasElement && this._coliderCanvasElement) {
      this._coliderCanvas.setCanvas(this._coliderCanvasElement, this._secondaryCanvasElement)
    }
  }

  mouseMove(e: MouseEvent) {
    const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const cursor = this._coliderCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y)
    this.cursorChipX = cursor.x
    this.cursorChipY = cursor.y
  }

  mouseDown(e: MouseEvent) {
    const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._coliderCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y, e.button === 2)

    this._documentMouseMoveEventCallee = e => this.mouseMove(e)
    this._documentMouseUpEventCallee = e => this.mouseUp(e)

    document.addEventListener('mousemove', this._documentMouseMoveEventCallee)
    document.addEventListener('mouseup', this._documentMouseUpEventCallee)
  }

  mouseUp(e: MouseEvent) {
    const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this._coliderCanvas.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y)

    if (this._documentMouseMoveEventCallee) document.removeEventListener('mousemove', this._documentMouseMoveEventCallee)
    if (this._documentMouseUpEventCallee) document.removeEventListener('mouseup', this._documentMouseUpEventCallee)

    this._documentMouseMoveEventCallee = null
    this._documentMouseUpEventCallee = null
  }

  render() {
    this._gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight)
    if (this._gridImageGenerator.changed) {
      this._gridImageSrc = this._gridImageGenerator.generateLinePart().toDataURL()
    }

    return html`
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
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
          id="secondary-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        <div
          class="grid-image grid"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          @mousemove="${(e: MouseEvent) => !this._coliderCanvas.isMouseDown ? this.mouseMove(e) : null}"
          @contextmenu="${(e: MouseEvent) => this.preventDefaultContextMenu && e.preventDefault()}"
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

  disconnectedCallback() {
    super.disconnectedCallback()

    this._coliderCanvas.unsubscribeProjectEvent()
  }

  connectedCallback() {
    super.connectedCallback()

    if (this._coliderCanvas.hasProject && !this._coliderCanvas.isSubscribedProjectEvent) this._coliderCanvas.subscribeProjectEvent()
  }
}
