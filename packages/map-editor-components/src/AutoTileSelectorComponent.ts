import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'
import { GridImageGenerator, Projects, Project, AutoTileSelector, CallbackItem } from '@piyoppi/pico2map-editor'

export class AutoTileSelectorComponent extends LitElement {
  private _gridImageSrc = ''
  private gridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _indexImage: HTMLCanvasElement = document.createElement('canvas')
  private _project: Project | null = null
  private _autoTileSelector: AutoTileSelector | null = null
  private _afterAddAutoTileCallbackItem: CallbackItem | null = null
  private _afterRemoveAutoTileCallbackItem: CallbackItem | null = null
  private _afterReplacedMapChipImageCallbackItem: CallbackItem | null = null

  static readonly Format = {
    width: 1,
    height: 5
  }

  @property({type: String})
  get gridColor(): string {
    return this.gridImageGenerator.gridColor
  }
  set gridColor(value: string) {
    const oldValue = this.gridImageGenerator.gridColor
    this.gridImageGenerator.gridColor = value

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
    this._setupProject()

    this.setupMapChipSelector()

    this.requestUpdate('projectId', oldValue);
  }

  private _width = 192
  @property({type: Number})
  get width(): number {
    return this._width
  }
  set width(value: number) {
    const oldValue = this._width

    this._width = value
    this.setupMapChipSelector()

    this.requestUpdate('width', oldValue);
  }

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0
  @property({type: Number}) selectedChipY = -1
  @property({type: Number}) selectedChipX = -1
  @property({type: String}) indexImageSrc = ''

  get project() {
    return this._project
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

  get selectedPosition() {
    return {
      x: this.selectedChipX * this.gridWidth,
      y: this.selectedChipY * this.gridHeight
    }
  }

  get subscribedProjectEvent() {
    return !!this._afterAddAutoTileCallbackItem && !!this._afterRemoveAutoTileCallbackItem && !!this._afterReplacedMapChipImageCallbackItem
  }

  private _setupProject() {
    if (this._project?.projectId === this._projectId) return

    this._project = Projects.fromProjectId(this._projectId)
    if (!this._project) {
      this.reset()
      return
    }

    this._subscribeProjectEvent()

    this._autoTileSelector = new AutoTileSelector(
      this.width,
      this._project.tiledMap.chipWidth,
      this._project.tiledMap.chipHeight,
      this._project.tiledMap.autoTiles,
      this._project.tiledMap.mapChipsCollection
    )

    this.selectedChipX = -1
    this.selectedChipY = -1
  }

  private _subscribeProjectEvent() {
    if (!this._project) return

    if (!this._afterAddAutoTileCallbackItem) this._afterAddAutoTileCallbackItem = this._project.setCallback('afterAddAutoTile', () => this.setupMapChipSelector())
    if (!this._afterRemoveAutoTileCallbackItem) this._afterRemoveAutoTileCallbackItem = this._project.setCallback('afterRemoveAutoTile', () => this.setupMapChipSelector())
    if (!this._afterReplacedMapChipImageCallbackItem) this._afterReplacedMapChipImageCallbackItem = this._project.setCallback('afterReplacedMapChipImage', () => this.setupMapChipSelector())
  }

  private _unsubscribeProjectEvent() {
    if (!this._project) return

    if (this._afterAddAutoTileCallbackItem) this._project.removeCallback('afterAddAutoTile', this._afterAddAutoTileCallbackItem)
    if (this._afterRemoveAutoTileCallbackItem) this._project.removeCallback('afterRemoveAutoTile', this._afterRemoveAutoTileCallbackItem)
    if (this._afterReplacedMapChipImageCallbackItem) this._project.removeCallback('afterReplacedMapChipImage', this._afterReplacedMapChipImageCallbackItem)

    this._afterAddAutoTileCallbackItem = null
    this._afterRemoveAutoTileCallbackItem = null
    this._afterReplacedMapChipImageCallbackItem = null
  }

  private reset() {
    this.indexImageSrc = ''
  }

  private setupMapChipSelector() {
    if (!this._project || !this._autoTileSelector) return

    if (this._project.tiledMap.autoTiles.length > 0) {
      this._autoTileSelector.canvasWidth = this.width
      const imageSize = this._autoTileSelector.getSizeOfIndexImage()
      this._indexImage.width = imageSize.width
      this._indexImage.height = imageSize.height
      this._autoTileSelector.generateIndexImage(this._indexImage)
      this.indexImageSrc = this._indexImage.toDataURL()
    } else {
      this.reset()
    }
  }

  mouseMove(e: MouseEvent) {
    if (!this._autoTileSelector) return;

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const position = this._autoTileSelector.convertFromIndexImageToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)

    this.cursorChipX = position.x
    this.cursorChipY = position.y
  }

  mouseDown(e: MouseEvent) {
    if (!this._project || !this._autoTileSelector) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const selectedAutoTile = this._autoTileSelector.getAutoTileFragmentFromIndexImagePosition(mouseCursorPosition.x, mouseCursorPosition.y)

    if (!selectedAutoTile) return

    this.selectedChipX = Math.floor(mouseCursorPosition.x / this._project.tiledMap.chipWidth)
    this.selectedChipY = Math.floor(mouseCursorPosition.y / this._project.tiledMap.chipHeight)

    this.dispatchEvent(
      new CustomEvent('autotile-selected', {
        detail: {id: selectedAutoTile.id},
        bubbles: true,
        composed: true
      })
    )
  }

  firstUpdated() {
    const element = this.shadowRoot?.getElementById('boundary')
    if (element) this.cursorPositionCalculator.setElement(element)
  }

  render() {
    this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight)
    if (this.gridImageGenerator.changed) {
      this._gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL()
    }

    const cursorWidth = this.gridWidth
    const cursorHeight = this.gridHeight

    return html`
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
          width: ${this._indexImage.width}px;
          height: ${this._indexImage.height}px;
        }

        .cursor {
          width: ${cursorWidth}px;
          height: ${cursorHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .selected {
          width: ${cursorWidth}px;
          height: ${cursorHeight}px;
          left: ${this.selectedPosition.x}px;
          top: ${this.selectedPosition.y}px;
        }
      </style>

      <div id="boundary">
        ${this.indexImageSrc ? html`
          <img id="chip-image" src="${this.indexImageSrc}">
          <div
            class="grid-image grid"
            @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
            @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          ></div>
          <div class="cursor"></div>
          ${(this.selectedChipX >= 0 && this.selectedChipY >= 0) ? html`<div class="selected"></div>` : null}
        ` : null}
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
      }

      .cursor, .selected {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
      }

      .cursor {
        border-color: red;
        pointer-events: none;
      }

      .selected {
        border-color: blue;
        pointer-events: none;
      }

      #boundary {
        position: relative;
      }

      #chip-image {
        display: block;
        user-select: none;
      }
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._unsubscribeProjectEvent()
  }

  connectedCallback() {
    super.connectedCallback()

    this._subscribeProjectEvent()
  }
}
