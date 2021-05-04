import { Arrangement, ArrangementPaint } from '../../src/Brushes/Arrangements/Arrangement'
import { BrushPaint } from './../../src/Brushes/Brush'

export class EmptyArrangement<T> implements Arrangement<T> {
  setMapChips(_: Array<T>) {}
  apply(_: Array<BrushPaint>): Array<ArrangementPaint<T>> { return [] }
}

