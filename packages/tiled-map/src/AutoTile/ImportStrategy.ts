/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChipFragment } from "./../MapChip"
export type MapChipFragmentGroups = Array<Array<MapChipFragment>>

export interface AutoTileImportStrategy {
  getMapChipFragments(): MapChipFragmentGroups
}
