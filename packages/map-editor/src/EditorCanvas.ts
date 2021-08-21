/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

export interface EditorCanvas {
  mouseDown(x: number, y: number): void,
  mouseMove(x: number, y: number): {x: number, y: number},
  mouseUp(x: number, y: number): void
}
