import { MapChipFragment, TiledMapData, AutoTile, AutoTiles, ColiderTypes } from '@piyoppi/pico2map-tiled'
import { BrushPaint } from './../Brush'

export interface ArrangementPaint<T> {
  x: number,
  y: number,
  item: T
}

export interface Arrangement<T> {
  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<T>>
}

export interface MapChipFragmentRequired {
  setMapChips(mapChips: Array<MapChipFragment>): void
}
export function isMapChipFragmentRequired(obj: any): obj is MapChipFragmentRequired {
  return typeof obj.setMapChips === 'function'
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

export interface ColiderTypesRequired {
  setColiderTypes(type: ColiderTypes): void
}
export function isColiderTypesRequired (obj: any): obj is ColiderTypesRequired {
  return typeof obj.setColiderTypes === 'function'
}

export interface ArrangementDescription<T> {
  name: string
  create(): Arrangement<T>
}
