import { MapChipFragment } from '../../MapChip'
import { Arrangement, ArrangementDescription, TiledMapDataRequired, AutoTilesRequired } from './Arrangement'
import { EraseArrangement } from './EraseArrangement'
import { AutoTileEraseArrangement } from './AutoTileEraseArrangement'
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap'
import { AutoTiles } from '../../AutoTile/AutoTiles'

export const DefaultEraseArrangementDescription: ArrangementDescription = {
  name: 'DefaultEraseArrangement',
  create: () => new DefaultEraseArrangement()
}

export class DefaultEraseArrangement implements Arrangement, TiledMapDataRequired, AutoTilesRequired {
  private defaultEraser = new EraseArrangement()
  private autoTileEraser = new AutoTileEraseArrangement()
  private _tiledMapData: TiledMapData | null = null

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
    this.autoTileEraser.setTiledMapData(tiledMapData)
  }

  setAutoTiles(autoTiles: AutoTiles) {
    this.autoTileEraser.setAutoTiles(autoTiles)
  }

  setMapChips(_: Array<MapChipFragment>) {
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    const autoTilePaints: Array<BrushPaint> = []
    const otherPaints: Array<BrushPaint> = []

    paints.forEach(paint => {
      if (!this._tiledMapData) throw new Error('MapData is not set.')

      const chip = this._tiledMapData.getMapDataFromChipPosition(paint.x, paint.y)

      if (chip?.arrangementName === 'AutoTileArrangement') {
        autoTilePaints.push(paint)
      } else {
        otherPaints.push(paint)
      }
    })

    return [...this.autoTileEraser.apply(autoTilePaints), ...this.defaultEraser.apply(otherPaints)]
  }
}
