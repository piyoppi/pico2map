import { TiledMap } from "./TiledMap"
import { MapChipFragment } from './MapChip'
import { MapChipImage } from './MapChips'

export class MapChipSelector {
  private _selectedChips: Array<MapChipFragment> = []

  constructor(
    private _tiledMap: TiledMap
  ) {
    
  }

  get selectedChips() {
    return this._selectedChips
  }

  public select(chipImage: MapChipImage, x: number, y: number) {
    this._selectedChips.push(new MapChipFragment(x, y, chipImage.id))
  }

  public clear() {
    this._selectedChips.length = 0
  }

  public selectAtMouseCursor(chipImage: MapChipImage, cursorX: number, cursorY: number, width: number = 1, height: number = 1) {
    this.clear()

    const chipPosition = this.convertFromImagePositionToChipPosition(chipImage, cursorX, cursorY)
    const chipCount = chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight)

    if (chipPosition.x + width > chipCount.width) {
      chipPosition.x = chipCount.width - width
    }

    if (chipPosition.y + height > chipCount.height) {
      chipPosition.y = chipCount.height - height
    }

    if (chipPosition.x < 0 || chipPosition.y < 0) {
      throw new Error('MapChipImage is not enough size.')
    }

    for (let x = 0; x < width; x++ ) {
      for (let y = 0; y < height; y++ ) {
        this.select(chipImage, chipPosition.x + x, chipPosition.y + y)
      }
    }
  }

  public convertFromImagePositionToChipPosition(chipImage: MapChipImage, x: number, y: number) {
    const chipCount = chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight)
    return {
      x: Math.max(0, Math.min(Math.floor(x / this._tiledMap.chipWidth), chipCount.width - 1)),
      y: Math.max(0, Math.min(Math.floor(y / this._tiledMap.chipHeight), chipCount.height - 1))
    }
  }
}
