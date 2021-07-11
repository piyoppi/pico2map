import { TiledMap, MapChipFragment, MapChipImage } from '@piyoppi/pico2map-tiled'

export class MapChipSelector {
  private _selectedChips: Array<MapChipFragment> = []
  private _selecting = false
  private _startChipPosition = {x: -1, y: -1}
  private _endChipPosition = {x: -1, y: -1}

  constructor(
    private _tiledMap: TiledMap,
    private _chipImage: MapChipImage
  ) {
    
  }

  get chipImage() {
    return this._chipImage
  }

  get selectedChips() {
    return this._selectedChips
  }

  get selecting() {
    return this._selecting
  }

  get startChipPosition() {
    return {
      x: Math.min(this._startChipPosition.x, this._endChipPosition.x),
      y: Math.min(this._startChipPosition.y, this._endChipPosition.y)
    }
  }

  get startPosition() {
    const startChipPosition = this.startChipPosition
    return {
      x: startChipPosition.x * this._tiledMap.chipWidth,
      y: startChipPosition.y * this._tiledMap.chipHeight
    }
  }

  get selectedChipSize() {
    return {
      width: (Math.abs(this._endChipPosition.x - this._startChipPosition.x) + 1),
      height: (Math.abs(this._endChipPosition.y - this._startChipPosition.y) + 1)
    }
  }

  get selectedSize() {
    const selectedChipSize = this.selectedChipSize
    return {
      width: selectedChipSize.width * this._tiledMap.chipWidth,
      height: selectedChipSize.height * this._tiledMap.chipHeight
    }
  }

  clear() {
    this._selectedChips.length = 0
  }

  private _selectAtMouseCursor() {
    this.clear()

    const chipPosition = {
      x: Math.min(this._startChipPosition.x, this._endChipPosition.x),
      y: Math.min(this._startChipPosition.y, this._endChipPosition.y)
    }
    const maximumChipCount = this._chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight)
    const {width, height} = this.selectedChipSize

    if (chipPosition.x + width > maximumChipCount.width) {
      chipPosition.x = maximumChipCount.width - width
    }

    if (chipPosition.y + height > maximumChipCount.height) {
      chipPosition.y = maximumChipCount.height - height
    }

    if (chipPosition.x < 0 || chipPosition.y < 0) {
      throw new Error('MapChipImage is not enough size.')
    }

    for (let x = 0; x < width; x++ ) {
      for (let y = 0; y < height; y++ ) {
        this._selectedChips.push(new MapChipFragment(chipPosition.x + x, chipPosition.y + y, this._chipImage.id))
      }
    }
  }

  mouseDown(x: number, y: number) {
    const chipPosition = this.convertFromImagePositionToChipPosition(x, y)

    this._startChipPosition = {...chipPosition}
    this._endChipPosition = {...chipPosition}

    this._selecting = true
  }

  mouseMove(x: number, y: number) {
    if (!this._selecting) return

    const chipPosition = this.convertFromImagePositionToChipPosition(x, y)

    this._endChipPosition = {...chipPosition}
  }

  mouseUp(x: number, y: number) {
    if (!this._selecting) return

    const chipPosition = this.convertFromImagePositionToChipPosition(x, y)
    this._endChipPosition = {...chipPosition}

    this._selectAtMouseCursor()
    this._selecting = false
  }

  convertFromImagePositionToChipPosition(x: number, y: number) {
    const chipCount = this._chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight)
    return {
      x: Math.max(0, Math.min(Math.floor(x / this._tiledMap.chipWidth), chipCount.width - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this._tiledMap.chipHeight), chipCount.height - 1))
    }
  }
}
