import { MapChipFragment, MapChip, TiledMapDataItem } from '@piyoppi/tiled-map'
import { Arrangement, ArrangementPaint, ArrangementDescription } from './Arrangement'
import { BrushPaint } from './../Brush'

export const EraseArrangementDescription: ArrangementDescription<TiledMapDataItem> = {
  name: 'EraseArrangement',
  create: () => new EraseArrangement()
}

export class EraseArrangement implements Arrangement<TiledMapDataItem> {
  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    return paints.map(paint => ({...paint, item: null}))
  }
}
