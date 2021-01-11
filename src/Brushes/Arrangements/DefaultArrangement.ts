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
    if (mapChips.length !== 1) throw new Error('Invalid count of map chips. DefaultArrangement requires a map chip.')
    this._mapChips = mapChips 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    return paints.map(paint => ({...paint, chip: this._mapChips[0]}))
  }
}
