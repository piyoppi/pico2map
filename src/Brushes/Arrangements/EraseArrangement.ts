import { MapChip } from '../../MapChip'
import { Arrangement, ArrangementDescription } from './Arrangement'
import { BrushPaint } from './../Brush'

export const EraseArrangementDescription: ArrangementDescription = {
  name: 'EraseArrangement',
  create: () => new EraseArrangement()
}

export class EraseArrangement implements Arrangement {
  setMapChips(_: Array<MapChip>) {
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    return paints.map(paint => ({...paint, chip: null}))
  }
}
