/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Arrangement, ArrangementPaint, ArrangementDescription, TiledMapDataRequired, AutoTilesRequired } from './Arrangement'
import { EraseArrangement } from './EraseArrangement'
import { AutoTileEraseArrangement } from './AutoTileEraseArrangement'
import { BrushPaint } from './../Brush'
import { MapChipFragment, TiledMapData, TiledMapDataItem, AutoTiles } from '@piyoppi/pico2map-tiled'

export const DefaultEraseArrangementDescription: ArrangementDescription<TiledMapDataItem> = {
  name: 'DefaultEraseArrangement',
  create: () => new DefaultEraseArrangement()
}

export class DefaultEraseArrangement implements Arrangement<TiledMapDataItem>, TiledMapDataRequired, AutoTilesRequired {
  private defaultEraser = new EraseArrangement()
  private autoTileEraser = new AutoTileEraseArrangement()
  private _tiledMapData: TiledMapData | null = null

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
    this.autoTileEraser.setTiledMapData(tiledMapData)
  }

  setAutoTiles(autoTiles: AutoTiles) {
    this.autoTileEraser.setAutoTiles(autoTiles)
  }

  apply(paints: Array<BrushPaint>): Array<ArrangementPaint<TiledMapDataItem>> {
    const autoTilePaints: Array<BrushPaint> = []
    const otherPaints: Array<BrushPaint> = []

    paints.forEach(paint => {
      if (!this._tiledMapData) throw new Error('MapData is not set.')

      const chip = this._tiledMapData.getFromChipPosition(paint.x, paint.y)

      if (chip?.arrangementName === 'AutoTileArrangement') {
        autoTilePaints.push(paint)
      } else {
        otherPaints.push(paint)
      }
    })

    return [...this.autoTileEraser.apply(autoTilePaints), ...this.defaultEraser.apply(otherPaints)]
  }
}
