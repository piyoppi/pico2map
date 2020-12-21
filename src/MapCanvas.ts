import { TiledMap } from './TiledMap'
import { MapChip } from './MapChip'

export class MapCanvas {
  constructor(
    private tiledMap: TiledMap
  ) {

  }

  public convertFromCursorPositionToChipPosition(x: number, y: number) {
    return {
      x: Math.floor(x / this.tiledMap.chipWidth),
      y: Math.floor(y / this.tiledMap.chipHeight)
    }
  }
}
