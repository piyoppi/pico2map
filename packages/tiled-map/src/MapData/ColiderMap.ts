/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChip, MapChipProperties,  AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './../MapChip'
import { ColiderTypes, TiledColisionDetectable } from '@piyoppi/pico2map-tiled-colision-detector'
import { MapMatrix } from './MapMatrix'

export type ColiderMapProperties = {
  chipCountX: number,
  chipCountY: number,
  coliders: Array<ColiderTypes>
}

export class ColiderMap extends MapMatrix<ColiderTypes> implements TiledColisionDetectable {
  toObject(): ColiderMapProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      coliders: this._items
    }
  }

  static fromObject(val: ColiderMapProperties) {
    return new ColiderMap(val.chipCountX, val.chipCountY, val.coliders)
  }

  protected allocate() {
    super.allocate(0)
  }
}
