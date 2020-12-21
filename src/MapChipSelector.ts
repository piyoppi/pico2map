import { MapChip } from './MapChip'

export class MapChipSelector {
  private chipWidth: number = 0
  private chipHeight: number = 0
  private _selectedChip: MapChip = {x: 0, y: 0}

  constructor() {
    
  }

  get selectedChip(): MapChip {
    return this._selectedChip
  }

  public setChipSize(chipWidth: number, chipHeight: number) {
    this.chipWidth = chipWidth
    this.chipHeight = chipHeight
  }

  public select(x: number, y: number) {
    this._selectedChip = {x, y}
  }

  public selectAtMouseCursor(cursorX: number, cursorY: number) {
    const chipPosition = this.convertFromImagePositionToChipPosition(cursorX, cursorY)
    this.select(chipPosition.x, chipPosition.y)
  }

  public convertFromImagePositionToChipPosition(x: number, y: number): MapChip {
    return {
      x: Math.floor(x / this.chipWidth),
      y: Math.floor(y / this.chipHeight)
    }
  }
}
