import { MapChip } from '../../MapChip';
import { Arrangement } from './Arrangement';
import { BrushPaint } from './../Brush'

export class DefaultArrangement implements Arrangement {
  private _mapChips: Array<MapChip> = []
  
  setMapChips(mapChips: Array<MapChip>) {
    this._mapChips = mapChips 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    return paints
  }
}
