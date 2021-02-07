import { MapChipFragment, TiledMapData, AutoTile, AutoTiles } from '@piyoppi/tiled-map'
import { BrushPaint } from './../Brush'

export interface ArrangementPaint<T> {
  x: number,
  y: number,
  item: T
}

export interface Arrangement<T> {
  setMapChips(mapChips: Array<MapChipFragment>): void
  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<T>>
}

export interface TiledMapDataRequired {
  setTiledMapData(tiledMapData: TiledMapData): void
}
export function isTiledMapDataRequired(obj: any): obj is TiledMapDataRequired {
  return typeof obj.setTiledMapData === 'function'
}

export interface AutoTileRequired {
  setAutoTile(autoTile: AutoTile): void
}
export function isAutoTileRequired(obj: any): obj is AutoTileRequired {
  return typeof obj.setAutoTile === 'function'
}

export interface AutoTilesRequired {
  setAutoTiles(autoTiles: AutoTiles): void
}
export function isAutoTilesRequired(obj: any): obj is AutoTilesRequired {
  return typeof obj.setAutoTiles === 'function'
}

export interface ArrangementDescription<T> {
  name: string
  create(): Arrangement<T>
}