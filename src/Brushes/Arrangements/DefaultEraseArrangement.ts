import { MapChipFragment } from '../../MapChip'
import { Arrangement, ArrangementDescription, TiledMapDataRequired } from './Arrangement'
import { EraseArrangement } from './EraseArrangement'
import { AutoTileEraseArrangement } from './AutoTileEraseArrangement'
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap'

export const DefaultEraseArrangementDescription: ArrangementDescription = {
  name: 'DefaultEraseArrangement',
  create: () => new DefaultEraseArrangement()
}

export class DefaultEraseArrangement implements Arrangement, TiledMapDataRequired {
  private defaultEraser = new EraseArrangement()
  private autoTileEraser = new AutoTileEraseArrangement()
  private _tiledMapData: TiledMapData | null = null

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
    this.autoTileEraser.setTiledMapData(tiledMapData)
  }

  setMapChips(_: Array<MapChipFragment>) {
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    return paints.map(paint => {
      if (!this._tiledMapData) throw new Error('MapData is not set.')

      const chip = this._tiledMapData.getMapDataFromChipPosition(paint.x, paint.y)

      if (chip?.arrangementName === 'AutoTileArrangement') {
        return this.autoTileEraser.apply(paints)
      } else {
        return this.defaultEraser.apply(paints)
      }
    }).flat()
  }
}
