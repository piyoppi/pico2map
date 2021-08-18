/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChipFragment, MapChipFragmentProperties } from './../MapChip'

export type AutoTileProperties = {
  id: number,
  mapChipFragments: Array<MapChipFragmentProperties>
}

export class AutoTile {
  constructor(
    private _mapChipFragments: Array<MapChipFragment>,
    private _id: number
  ) {
  }

  get id() {
    return this._id
  }

  get mapChipFragments() {
    return this._mapChipFragments
  }

  getMapChipImageIds(): Array<number> {
    const chipIds = new Set<number>()
    this._mapChipFragments.forEach(fragment => chipIds.add(fragment.chipId))

    return Array.from(chipIds.values())
  }

  toObject(): AutoTileProperties {
    return {
      id: this._id,
      mapChipFragments: this._mapChipFragments.map(fragment => fragment.toObject())
    }
  }

  static fromObject(val: AutoTileProperties): AutoTile {
    return new AutoTile(val.mapChipFragments.map(fragment => MapChipFragment.fromObject(fragment)), val.id)
  }
}
