import { MapChip } from './../../MapChip'
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap';

export interface Arrangement {
  setMapChips(mapChips: Array<MapChip>): void
  apply(paints: Array<BrushPaint>): Array<BrushPaint>
}

export interface TiledMapDataRequired {
  setTiledMapData(tiledMapData: TiledMapData): void
}
export function isTiledMapDataRequired(obj: any): obj is TiledMapDataRequired {
  return typeof obj.setTiledMapData === 'function'
}

export interface ArrangementDescription {
  name: string
  create(): Arrangement
}
