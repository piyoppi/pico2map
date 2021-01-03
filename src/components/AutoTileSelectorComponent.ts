import { LitElement, html, css, customElement, property } from 'lit-element'
import { GridImageGenerator } from '../GridImageGenerator'
import { CursorPositionCalculator } from './helpers/CursorPositionCalculator'
import { Projects, Project } from './../Projects'
import { MapChipImage } from './../MapChips'

@customElement('auto-tile-selector-component')
export class AutoTileSelectorComponent extends LitElement {
  private _gridImageSrc = ''
  private gridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _project: Project | null = null
  private _chipImage: MapChipImage | null = null

  static readonly Format = {
    width: 1,
    height: 5
  }

  private _projectId = -1
  @property({type: Number})
  get projectId(): number {
    return this._projectId
  }
  set projectId(value: number) {
    const oldValue = this._projectId
    this._projectId = value
    this._project = Projects.fromProjectId(value)

    this.setupMapChipSelector()

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
  @property({type: Number}) selectedChipY = 0
  @property({type: Number}) selectedChipX = 0

  get mapChipSelector() {
    return this._project?.mapChipSelector
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

  private setupMapChipSelector() {
    if (!this._project || this._chipId < 0) return

    this._chipImage = this._project.tiledMap.mapChipsCollection.findById(this._chipId)
  }

  mouseMove(e: MouseEvent) {
    if (!this.mapChipSelector || !this._chipImage || !this._project) return;

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const chip = this.mapChipSelector.convertFromImagePositionToChipPosition(this._chipImage, mouseCursorPosition.x, mouseCursorPosition.y)
    const chipCount = this._chipImage.getChipCount(this._project.tiledMap.chipWidth, this._project.tiledMap.chipHeight)

    if (chip.x + AutoTileSelectorComponent.Format.width > chipCount.width) return
    if (chip.y + AutoTileSelectorComponent.Format.height > chipCount.height) return

    this.cursorChipX = chip.x
    this.cursorChipY = chip.y
  }

  mouseDown(e: MouseEvent) {
    if (!this.mapChipSelector || !this._chipImage) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    this.mapChipSelector.selectAtMouseCursor(this._chipImage, mouseCursorPosition.x, mouseCursorPosition.y, AutoTileSelectorComponent.Format.width, AutoTileSelectorComponent.Format.height)

    const selectedChip = this.mapChipSelector.selectedChips[0]
    if (!selectedChip || this.mapChipSelector.selectedChips.length !== AutoTileSelectorComponent.Format.width * AutoTileSelectorComponent.Format.height) return

    this.selectedChipX = selectedChip.x
    this.selectedChipY = selectedChip.y

    this.dispatchEvent(
      new CustomEvent('selected', {
        detail: {},
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

    const cursorWidth = this.gridWidth * AutoTileSelectorComponent.Format.width
    const cursorHeight = this.gridHeight * AutoTileSelectorComponent.Format.height

    return html`
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
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
        <img id="chip-image" src="${this._chipImage?.src}">
        <div
          class="grid-image grid"
          @mousemove="${(e: MouseEvent) => this.mouseMove(e)}"
          @mousedown="${(e: MouseEvent) => this.mouseDown(e)}"
        ></div>
        <div class="cursor"></div>
        <div class="selected"></div>
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
    `
  }
}
