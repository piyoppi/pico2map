/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChipFragment, MapChip, TiledMapDataItem } from '@piyoppi/pico2map-tiled'
import { Arrangement, ArrangementPaint, ArrangementDescription } from './Arrangement'
import { BrushPaint } from './../Brush'

export const EraseArrangementDescription: ArrangementDescription<TiledMapDataItem> = {
  name: 'EraseArrangement',
  create: () => new EraseArrangement()
}

export class EraseArrangement implements Arrangement<TiledMapDataItem> {
  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    return paints.map(paint => ({...paint, item: null}))
  }
}
