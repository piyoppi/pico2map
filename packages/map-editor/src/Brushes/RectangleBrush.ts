/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { Brush, BrushPaint, BrushDescription } from './Brush'
import { Arrangement, ArrangementPaint } from './Arrangements/Arrangement'
import { DefaultArrangement } from './Arrangements/DefaultArrangement'
import { TiledMapDataItem } from '@piyoppi/pico2map-tiled'

export const RectangleBrushDescription: BrushDescription = {
  name: 'RectangleBrush',
  create: <T>() => new RectangleBrush<T>()
}

export class RectangleBrush<T> implements Brush<T> {
  private _isMouseDown = false
  private _startPosition = {x: 0, y: 0}
  private _arrangement: Arrangement<T> | null = null

  setArrangement(arrangement: Arrangement<T>) {
    this._arrangement = arrangement
  }

  mouseDown(chipX: number, chipY: number) {
    this._isMouseDown = true
    this._startPosition = {x: chipX, y: chipY}
  }

  mouseMove(chipX: number, chipY: number): Array<ArrangementPaint<T>> {
    if (!this._isMouseDown) return []

    return this._build(chipX, chipY)
  }

  mouseUp(chipX: number, chipY: number): Array<ArrangementPaint<T>> {
    this._isMouseDown = false

    return this._build(chipX, chipY)
  }

  private _build(chipX: number, chipY: number) {
    if (!this._arrangement) throw new Error('Arrangement is not set.')

    const paints: Array<BrushPaint> = []
    const startX = Math.min(this._startPosition.x, chipX)
    const startY = Math.min(this._startPosition.y, chipY)
    const endX = Math.max(this._startPosition.x, chipX)
    const endY = Math.max(this._startPosition.y, chipY)

    for(let x = startX; x <= endX; x++ ) {
      for(let y = startY; y <= endY; y++ ) {
        paints.push({x, y})
      }
    }

    return this._arrangement.apply(paints)
  }

  cleanUp() {
  }
}
