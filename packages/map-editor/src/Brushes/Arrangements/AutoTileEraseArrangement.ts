import { Arrangement, ArrangementPaint, ArrangementDescription, TiledMapDataRequired, AutoTilesRequired } from './Arrangement'
import { BrushPaint } from './../Brush'
import { AutoTileArrangement } from './AutoTileArrangement'
import { MapChipFragment, TiledMapData, TiledMapDataItem, AutoTileMapChip, AutoTiles } from '@piyoppi/tiled-map'

export const AutoTileEraseArrangementDescription: ArrangementDescription<TiledMapDataItem> = {
  name: 'AutoTileEraseArrangement',
  create: () => new AutoTileEraseArrangement()
}

export class AutoTileEraseArrangement implements Arrangement<TiledMapDataItem>, TiledMapDataRequired, AutoTilesRequired {
  private _autoTileArrangement = new AutoTileArrangement()
  private _tiledMapData: TiledMapData | null = null
  private _autoTiles: AutoTiles | null = null

  setMapChips(_: Array<MapChipFragment>) {
  }

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
  }

  setAutoTiles(autoTiles: AutoTiles) {
    this._autoTiles = autoTiles
  }

  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    if (paints.length === 0) return []

    return this.erase(paints)
  }

  erase(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    if (!this._tiledMapData) throw new Error('MapData is not set.')
    if (!this._autoTiles) throw new Error('AutoTiles is not set')

    const resultPaints: Array<ArrangementPaint<TiledMapDataItem>> = []

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
      resultPaints.push({x: paint.x, y: paint.y, item: null})

      this._autoTileArrangement.setTiledMapData(tiledBuffer)

      for (let y = paintPositionAtBuffer.y - 1; y <= paintPositionAtBuffer.y + 1; y++) {
        for (let x = paintPositionAtBuffer.x - 1; x <= paintPositionAtBuffer.x + 1; x++) {
          if (x === paintPositionAtBuffer.x && y === paintPositionAtBuffer.y) continue

          const item = tiledBuffer.getFromChipPosition(x, y)

          if (item && item instanceof AutoTileMapChip) {
            const autoTile = this._autoTiles?.fromId(item.autoTileId)
            if (!autoTile) continue

            this._autoTileArrangement.setAutoTile(autoTile)
            const appliedPaints = this._autoTileArrangement.apply([{x, y}])
            if (appliedPaints.length === 0) continue
            resultPaints.push({x: appliedPaints[0].x + bufferOffsetX, y: appliedPaints[0].y + bufferOffsetY, item: appliedPaints[0].item})
          }
        }
      }
    })

    return resultPaints
  }
}
