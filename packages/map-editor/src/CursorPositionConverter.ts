/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

export function convertFromCursorPositionToChipPosition(x: number, y: number, chipWidth: number, chipHeight: number, chipCountX: number, chipCountY: number, cursorWidth: number = 1, cursorHeight: number = 1) {
  const offsetX = (Math.floor(cursorWidth / 2) * chipWidth) / 2
  const offsetY = (Math.floor(cursorHeight / 2) * chipHeight) / 2
  return {
    x: Math.max(0, Math.min(Math.floor((x - offsetX) / chipWidth), chipCountX - 1)),
    y: Math.max(0, Math.min(Math.floor((y - offsetY) / chipHeight), chipCountY - 1))
  }
}

export function convertChipPositionDivisionByCursorSize(x: number, y: number, baseX: number, baseY: number, cursorWidth: number, cursorHeight: number) {
  return {
    x: Math.floor((x - baseX) / cursorWidth) * cursorWidth + baseX,
    y: Math.floor((y - baseY) / cursorHeight) * cursorHeight + baseY,
  }
}
