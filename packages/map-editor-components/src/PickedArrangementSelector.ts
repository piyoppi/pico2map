/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { PickedMapChipDetail } from './Events'
import { isAutoTileMapChip } from '@piyoppi/pico2map-tiled'

export function PickedArrangementSelector(detail: PickedMapChipDetail): string {
  if (isAutoTileMapChip(detail.picked)) {
    return 'AutoTileArrangement'
  } else if (detail.picked) {
    return 'DefaultArrangement'
  } else {
    return 'DefaultEraseArrangement'
  }
}
