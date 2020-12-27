import { MapChip } from './../../MapChip'
import { BrushPaint } from './../Brush'

export interface Arrangement {
  setMapChips(mapChips: Array<MapChip>): void
  apply(paints: Array<BrushPaint>): Array<BrushPaint>
}
