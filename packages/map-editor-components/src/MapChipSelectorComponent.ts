import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { GridImageGenerator, MapChipSelector, Projects, Project, CallbackItem } from '@piyoppi/pico2map-editor'
import { MapChipImage } from '@piyoppi/pico2map-tiled'
import { CursorPositionCalculator } from './Helpers/CursorPositionCalculator'

export class MapChipSelectorComponent extends LitElement {
  private _gridImageSrc = ''
  private gridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _project: Project | null = null
  private _mapChipSelector : MapChipSelector | null = null
  private _imageSrc: string = ''
  private _afterReplacedMapChipImageCallbackItem: CallbackItem | null = null

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

    if (this._project) {
      this.setupMapChipSelector()
    } else {
      this.reset()
    }

    this.requestUpdate('projectId', oldValue);
  }

  private _chipId = -1
  @property({type: Number})
  get chipId(): number {
    return this._chipId
  }
  set chipId(value: number) {
    const oldValue = this._chipId
    this._chipId = value

    this.setupMapChipSelector()

    this.requestUpdate('chipId', oldValue)
  }

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0
  @property({type: Number}) selectedX = 0
  @property({type: Number}) selectedY = 0
  @property({type: Number}) selectedWidth = 0
  @property({type: Number}) selectedHeight = 0

  get mapChipSelector() {
    if (!this._mapChipSelector) throw new Error('The project is not set')

    return this._mapChipSelector
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

  private _setupProject() {
    this._project = Projects.fromProjectId(this._projectId)
    if (!this._project) return

    this.subscribeProjectEvent()
  }

  private subscribeProjectEvent() {
    if (!this._project || this._afterReplacedMapChipImageCallbackItem) return

    this._afterReplacedMapChipImageCallbackItem = this._project.setCallback('afterReplacedMapChipImage', () => this.setupMapChipSelector())
  }

  }

  private setupMapChipSelector() {
    if (!this._project) return

    const chipImage = this._project.tiledMap.mapChipsCollection.findById(this._chipId)

    if (!chipImage) {
      this.reset()
      return
    }

    this._mapChipSelector = new MapChipSelector(this._project.tiledMap, chipImage)
    this._imageSrc = this._mapChipSelector.chipImage.src
  }

  private reset() {
    this._mapChipSelector = null
    this._imageSrc = ''
  }

  mouseUp(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.mapChipSelector.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y)

    const selectedChips = this.mapChipSelector.selectedChips

    this.dispatchEvent(
      new CustomEvent('mapchip-selected', {
        detail: {selectedMapChipProperties: selectedChips.map(chip => chip.toObject())},
        bubbles: true,
        composed: true
      })
    )

    this.syncSelectedCursor()
  }

  mouseMove(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.mapChipSelector.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y)

    this.syncSelectedCursor()

    const chip = this.mapChipSelector.convertFromImagePositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)
    this.cursorChipX = chip.x
    this.cursorChipY = chip.y
  }

  mouseDown(e: MouseEvent) {
    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.mapChipSelector.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y)

    this.syncSelectedCursor()
  }

  private syncSelectedCursor() {
    if (!this.mapChipSelector.selecting) return

    const startPosition = this.mapChipSelector.startPosition
    const selectedSize = this.mapChipSelector.selectedSize

    this.selectedX = startPosition.x
    this.selectedY = startPosition.y
    this.selectedWidth = selectedSize.width
    this.selectedHeight = selectedSize.height
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

    return html`
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
          width: ${this._mapChipSelector?.chipImage.image.width || 0}px;
          height: ${this._mapChipSelector?.chipImage.image.height || 0}px;
        }

        .cursor {
          width: ${this.gridWidth}px;
          height: ${this.gridHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .selected {
          width: ${this.selectedWidth}px;
          height: ${this.selectedHeight}px;
          left: ${this.selectedX}px;
          top: ${this.selectedY}px;
        }
      </style>

      <div id="boundary">
        <img id="chip-image" src="${this._imageSrc}">
        <div
          class="grid-image grid"
          @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
          @mouseup="${(e: MouseEvent) => this.mouseUp(e)}"
        ></div>
        ${this._imageSrc ? html`<div class="cursor"></div>` : null}
        ${(this._imageSrc && this.selectedWidth > 0 && this.selectedHeight > 0) ? html`<div class="selected"></div>` : null}
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
}
