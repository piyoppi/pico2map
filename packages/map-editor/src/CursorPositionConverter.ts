/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

export function convertFromCursorPositionToChipPosition(x: number, y: number, chipWidth: number, chipHeight: number, chipCountX: number, chipCountY: number) {
  return {
    x: Math.max(0, Math.min(Math.floor(x / chipWidth), chipCountX - 1)),
    y: Math.max(0, Math.min(Math.floor(y / chipHeight), chipCountY - 1))
  }
}
