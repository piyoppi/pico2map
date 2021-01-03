import { TiledMap } from "./TiledMap"
import { MapChip, MultiMapChip } from './MapChip'
import { MapChipImage } from './MapChips'

export class MapChipSelector {
  private chipWidth: number = 0
  private chipHeight: number = 0
  private _selectedChips: Array<MapChip> = []

  constructor(
    private _tiledMap: TiledMap
  ) {
    
  }

  get selectedChips() {
    return this._selectedChips
  }

  public select(chipImage: MapChipImage, x: number, y: number) {
    this._selectedChips.push(new MapChip(x, y, chipImage.id))
  }

  public clear() {
    this._selectedChips.length = 0
  }

  public selectAtMouseCursor(chipImage: MapChipImage, cursorX: number, cursorY: number, width: number = 1, height: number = 1) {
    this.clear()

    const chipPosition = this.convertFromImagePositionToChipPosition(cursorX, cursorY)
    for (let x = 0; x < width; x++ ) {
      for (let y = 0; y < height; y++ ) {
        this.select(chipImage, chipPosition.x + x, chipPosition.y + y)
      }
    }
  }

  public convertFromImagePositionToChipPosition(x: number, y: number) {
    return {
      x: Math.floor(x / this._tiledMap.chipWidth),
      y: Math.floor(y / this._tiledMap.chipHeight)
    }
  }
}
