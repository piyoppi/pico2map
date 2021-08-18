/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Brush, BrushPaint, BrushDescription } from './Brush'
import { Arrangement, ArrangementPaint } from './Arrangements/Arrangement'
import { DefaultArrangement } from './Arrangements/DefaultArrangement'
import { TiledMapDataItem } from '@piyoppi/pico2map-tiled'

export const PenDescription: BrushDescription = {
  name: 'Pen',
  create: <T>() => new Pen<T>()
}

export class Pen<T> implements Brush<T> {
  private _isMouseDown = false
  private painting: Array<BrushPaint> = []
  private _beforeCursorPosition = {x: -1, y: -1}
  private _arrangement: Arrangement<T> | null = null

  setArrangement(arrangement: Arrangement<T>) {
    this._arrangement = arrangement
  }

  mouseDown(chipX: number, chipY: number) {
    this._isMouseDown = true
    this.painting = []
  }

  mouseMove(chipX: number, chipY: number): Array<ArrangementPaint<T>> {
    if (!this._arrangement) throw new Error('Arrangement is not set.')
    if (!this._isMouseDown) return []

    const paint = {
      x: chipX,
      y: chipY,
      item: null
    }

    if (paint.x !== this._beforeCursorPosition.x || paint.y !== this._beforeCursorPosition.y) {
      this.painting.push(paint)
      this._beforeCursorPosition = paint
    }

    return this._arrangement.apply(this.painting)
  }

  mouseUp(chipX: number, chipY: number): Array<ArrangementPaint<T>> {
    if (!this._arrangement) throw new Error('Arrangement is not set.')

    this._isMouseDown = false
    return this._arrangement.apply(this.painting)
  }

  cleanUp() {
    this.painting.length = 0
    this._beforeCursorPosition = {x: -1, y: -1}
  }
}
