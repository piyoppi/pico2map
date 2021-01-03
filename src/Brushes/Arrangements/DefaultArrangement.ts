import { MapChip } from '../../MapChip'
import { Arrangement, ArrangementDescription } from './Arrangement'
import { BrushPaint } from './../Brush'

export const DefaultArrangementDescription: ArrangementDescription = {
  name: 'DefaultArrangement',
  create: () => new DefaultArrangement()
}

export class DefaultArrangement implements Arrangement {
  private _mapChips: Array<MapChip> = []
  
  setMapChips(mapChips: Array<MapChip>) {
    this._mapChips = mapChips 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    return paints
  }
}
