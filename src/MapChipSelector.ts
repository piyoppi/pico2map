import { TiledMap } from "./TiledMap"
import { MapChip } from './MapChip'

export class MapChipSelector {
  private chipWidth: number = 0
  private chipHeight: number = 0
  private _selectedChip: MapChip = {x: 0, y: 0, chipId: 0}
  private _activeChipId: number = -1

  constructor(
    private _tiledMap: TiledMap
  ) {
    
  }

  get selectedChip() {
    return this._selectedChip
  }

  get activeChips() {
    return this._tiledMap.mapChipsCollection.findById(this._activeChipId)
  }

  public setActiveChipId(value: number) {
    return this._activeChipId = value
  }

  public select(x: number, y: number) {
    this._selectedChip = {x, y, chipId: this._activeChipId}
  }

  public selectAtMouseCursor(cursorX: number, cursorY: number) {
    const chipPosition = this.convertFromImagePositionToChipPosition(cursorX, cursorY)
    this.select(chipPosition.x, chipPosition.y)
  }

  public convertFromImagePositionToChipPosition(x: number, y: number) {
    return {
      x: Math.floor(x / this._tiledMap.chipWidth),
      y: Math.floor(y / this._tiledMap.chipHeight)
    }
  }
}
