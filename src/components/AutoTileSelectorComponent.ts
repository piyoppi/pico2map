import { LitElement, html, css, customElement, property } from 'lit-element'
import { GridImageGenerator } from '../GridImageGenerator'
import { CursorPositionCalculator } from './helpers/CursorPositionCalculator'
import { Projects, Project } from './../Projects'
import { AutoTileSelector } from './../AutoTileSelector'

@customElement('auto-tile-selector-component')
export class AutoTileSelectorComponent extends LitElement {
  private _gridImageSrc = ''
  private gridImageGenerator = new GridImageGenerator()
  private cursorPositionCalculator = new CursorPositionCalculator()
  private _project: Project | null = null
  private _indexImage: HTMLCanvasElement = document.createElement('canvas')
  private _autoTileSelector: AutoTileSelector | null = null

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

  @property({type: Number}) cursorChipX = 0
  @property({type: Number}) cursorChipY = 0
  @property({type: Number}) selectedChipY = 0
  @property({type: Number}) selectedChipX = 0
  @property({type: Number}) width = 100
  @property({type: String}) indexImageSrc = ''

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
    if (!this._project) return

    this._autoTileSelector = new AutoTileSelector(
      this.width,
      this._project.tiledMap.chipWidth,
      this._project.tiledMap.chipHeight,
      this._project.tiledMap.autoTiles,
      this._project.tiledMap.mapChipsCollection
    )
    this._autoTileSelector.generateIndexImage(this._indexImage)
    this.indexImageSrc = this._indexImage.toDataURL()
  }

  mouseMove(e: MouseEvent) {
    if (!this._autoTileSelector) return;

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const position = this._autoTileSelector.convertFromIndexImageToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y)

    this.cursorChipX = position.x
    this.cursorChipY = position.y
  }

  mouseDown(e: MouseEvent) {
    if (!this.mapChipSelector || !this._project || !this._autoTileSelector) return

    const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY)
    const selectedAutoTile = this._autoTileSelector.getAutoTileFragmentFromIndexImagePosition(mouseCursorPosition.x, mouseCursorPosition.y)

    if (!selectedAutoTile) return

    this.mapChipSelector.clear()

    selectedAutoTile.mapChipFragments.forEach(mapChipFragment => {
      this.mapChipSelector?.select(mapChipFragment)
    })

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

    const cursorWidth = this.gridWidth
    const cursorHeight = this.gridHeight

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
        <img id="chip-image" src="${this.indexImageSrc}">
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
        position: absolute;
      }

      #chip-image {
        display: block;
      }
    `
  }
}
