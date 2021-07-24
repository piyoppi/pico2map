import { Arrangement, ArrangementPaint } from '../../src/Brushes/Arrangements/Arrangement'
import { BrushPaint } from './../../src/Brushes/Brush'
import { AutoTile, TiledMapData, TiledMapDataItem } from '@piyoppi/pico2map-tiled'

export class DummyAutoTileArrangement implements Arrangement<TiledMapDataItem> {
  setMapChips(_: Array<TiledMapDataItem>) {}
  setAutoTile(_: AutoTile) {}
  setTiledMapData(_: TiledMapData) {}
  apply(_: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> { return [] }
}
