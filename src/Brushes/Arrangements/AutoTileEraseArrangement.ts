import { MapChipFragment } from '../../MapChip'
import { Arrangement, ArrangementDescription, TiledMapDataRequired } from './Arrangement'
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap';
import { AutoTileArrangement } from './AutoTileArrangement'
import { AutoTileMapChip } from '../../MapChip';

export const AutoTileEraseArrangementDescription: ArrangementDescription = {
  name: 'AutoTileEraseArrangement',
  create: () => new AutoTileEraseArrangement()
}

export class AutoTileEraseArrangement implements Arrangement, TiledMapDataRequired {
  private _autoTileArrangement = new AutoTileArrangement()
  private _tiledMapData: TiledMapData | null = null

  setMapChips(_: Array<MapChipFragment>) {
  }

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    if (paints.length === 0) return []

    return this.erase(paints)
  }

  erase(paints: Array<BrushPaint>): Array<BrushPaint> {
    if (!this._tiledMapData) throw new Error('MapData is not set.')

    const resultPaints: Array<BrushPaint> = []

    const paintX1 = paints.reduce((acc, val) => Math.min(acc, val.x), this._tiledMapData.width)
    const paintY1 = paints.reduce((acc, val) => Math.min(acc, val.y), this._tiledMapData.height)
    const paintX2 = paints.reduce((acc, val) => Math.max(acc, val.x), 0)
    const paintY2 = paints.reduce((acc, val) => Math.max(acc, val.y), 0)

    const x1 = Math.max(paintX1 - 1, 0)
    const y1 = Math.max(paintY1 - 1, 0)
    const x2 = Math.min(paintX2 + 1, this._tiledMapData.width)
    const y2 = Math.min(paintY2 + 1, this._tiledMapData.height)

    const bufferWidth = x2 - x1 + 1
    const bufferHeight = y2 - y1 + 1

    const tiledBuffer = new TiledMapData(
      bufferWidth + 2,
      bufferHeight + 2
    )
    const bufferOffsetX = x1 - 1
    const bufferOffsetY = y1 - 1
    tiledBuffer.transferFromTiledMapData(this._tiledMapData, bufferOffsetX, bufferOffsetY, tiledBuffer.width, tiledBuffer.height, 0, 0)

    paints.forEach(paint => {
      const paintPositionAtBuffer = {x: paint.x - bufferOffsetX, y: paint.y - bufferOffsetY}

      tiledBuffer.put(null, paintPositionAtBuffer.x, paintPositionAtBuffer.y)
      resultPaints.push({x: paint.x, y: paint.y, chip: null})

      this._autoTileArrangement.setTiledMapData(tiledBuffer)

      for (let y = paintPositionAtBuffer.y - 1; y <= paintPositionAtBuffer.y + 1; y++) {
        for (let x = paintPositionAtBuffer.x - 1; x <= paintPositionAtBuffer.x + 1; x++) {
          if (x === paintPositionAtBuffer.x && y === paintPositionAtBuffer.y) continue

          const chip = tiledBuffer.getMapDataFromChipPosition(x, y)

          if (chip && chip instanceof AutoTileMapChip) {
            this._autoTileArrangement.setAutoTile(chip.autoTile)
            const appliedPaints = this._autoTileArrangement.apply([{x, y, chip}])
            if (appliedPaints.length === 0) continue
            resultPaints.push({x: appliedPaints[0].x + bufferOffsetX, y: appliedPaints[0].y + bufferOffsetY, chip: appliedPaints[0].chip})
          }
        }
      }
    })

    return resultPaints
  }
}
