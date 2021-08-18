/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChipFragment } from './../MapChip'
import { AutoTileImportStrategy, MapChipFragmentGroups } from './ImportStrategy'
import { MapChipImage } from './../MapChipImage'

type MapChipFragments = Array<MapChipFragment>

export class DefaultAutoTileImportStrategy implements AutoTileImportStrategy {
  constructor(
    private _mapChipImage: MapChipImage,
    private _chipWidth: number,
    private _chipHeight: number,
  ) {

  }

  getMapChipFragments() {
    const heightChipCountPerUnit = 5
    const countX = Math.floor(this._mapChipImage.image.width / this._chipWidth)
    const countY = Math.floor(
      Math.floor(this._mapChipImage.image.height / this._chipHeight) / heightChipCountPerUnit
    )
    const mapChipFragmentGroups: MapChipFragmentGroups = []

    for (let cy = 0; cy < countY; cy++) {
      const y = cy * heightChipCountPerUnit

      for (let x = 0; x < countX; x++) {
        const mapChipFragments: MapChipFragments = []
        mapChipFragments.push(new MapChipFragment(x, y, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 1, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 2, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 3, this._mapChipImage.id))
        mapChipFragments.push(new MapChipFragment(x, y + 4, this._mapChipImage.id))
        mapChipFragmentGroups.push(mapChipFragments)
      }
    }

    return mapChipFragmentGroups
  }
}
