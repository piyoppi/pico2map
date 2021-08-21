/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { MapChipFragment } from "./../MapChip"
export type MapChipFragmentGroups = Array<Array<MapChipFragment>>

export interface AutoTileImportStrategy {
  getMapChipFragments(): MapChipFragmentGroups
}
