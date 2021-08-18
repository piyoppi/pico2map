/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChipFragment, MapChip, TiledMapDataItem } from '@piyoppi/pico2map-tiled'
import { Arrangement, ArrangementPaint, ArrangementDescription, MapChipFragmentRequired } from './Arrangement'
import { BrushPaint } from './../Brush'

export const DefaultArrangementDescription: ArrangementDescription<TiledMapDataItem> = {
  name: 'DefaultArrangement',
  create: () => new DefaultArrangement()
}

export class DefaultArrangement implements Arrangement<TiledMapDataItem>, MapChipFragmentRequired {
  private _mapChips: Array<MapChipFragment> = []
  
  setMapChips(mapChips: Array<MapChipFragment>) {
    if (mapChips.length < 1) throw new Error('Invalid count of map chips. DefaultArrangement requires a map chip.')
    this._mapChips = mapChips 
  }

  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    if (this._mapChips.length < 1) throw new Error('Invalid count of map chips. DefaultArrangement requires a map chip.')
    const basePosition = {x: this._mapChips[0].x, y: this._mapChips[0].y}

    return paints.map(paint => {
      return this._mapChips.map(mapChip => ({
        x: paint.x + mapChip.x - basePosition.x,
        y: paint.y + mapChip.y - basePosition.y,
        item: new MapChip([mapChip])
      }))
    }).flat(1)
  }
}
