import { Arrangement, ArrangementPaint } from '../../src/Brushes/Arrangements/Arrangement'
import { BrushPaint } from './../../src/Brushes/Brush'
import { AutoTile } from '@piyoppi/pico2map-tiled'

export class DummyAutoTileArrangement<T> implements Arrangement<T> {
  setMapChips(_: Array<T>) {}
  setAutoTile(_: AutoTile) {}
  apply(_: Array<BrushPaint>): Array<ArrangementPaint<T>> { return [] }
}
