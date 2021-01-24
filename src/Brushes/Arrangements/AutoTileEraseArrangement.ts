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

    return this.erase(paints[0])
  }

  erase(paint: BrushPaint): Array<BrushPaint> {
    if (!this._tiledMapData) throw new Error('MapData is not set.')

    const resultPaints: Array<BrushPaint> = []
    const x1 = Math.max(paint.x - 1, 0)
    const y1 = Math.max(paint.y - 1, 0)
    const x2 = Math.min(paint.x + 1, this._tiledMapData.width)
    const y2 = Math.min(paint.y + 1, this._tiledMapData.height)
    const patchWidth = x2 - x1 + 1
    const patchHeight = y2 - y1 + 1

    const tiledBuffer = new TiledMapData(
      patchWidth + 2,
      patchHeight + 2
    )

    const erasePosition = {x: 2, y: 2}

    tiledBuffer.transferFromTiledMapData(this._tiledMapData, x1 - 1, y1 - 1, tiledBuffer.width, tiledBuffer.height, 0, 0)
    tiledBuffer.put(null, erasePosition.x, erasePosition.y)
    resultPaints.push({x: paint.x, y: paint.y, chip: null})

    this._autoTileArrangement.setTiledMapData(tiledBuffer)

    for (let y = 1; y < tiledBuffer.height - 1; y++) {
      for (let x = 1; x < tiledBuffer.width - 1; x++) {
        if (x === erasePosition.x && y === erasePosition.y) continue

        const chip = tiledBuffer.getMapDataFromChipPosition(x, y)

        if (chip && chip instanceof AutoTileMapChip) {
          this._autoTileArrangement.setAutoTile(chip.autoTile)
          const appliedPaints = this._autoTileArrangement.apply([{x, y, chip}])
          if (appliedPaints.length === 0) continue
          resultPaints.push({x: appliedPaints[0].x + x1 - 1, y: appliedPaints[0].y + y1 - 1, chip: appliedPaints[0].chip})
        }
      }
    }

    return resultPaints
  }
}
