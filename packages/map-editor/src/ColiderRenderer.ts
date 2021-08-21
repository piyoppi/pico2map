/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { TiledMap, MapChipFragment, MapChip } from '@piyoppi/pico2map-tiled'
import { ColiderTypes } from '@piyoppi/pico2map-tiled-colision-detector'

export class ColiderRenderer {
  private _backgroundRgba = {r: 255, g: 255, b: 255, a: 1.0}

  constructor(
    private _tiledMap: TiledMap
  ) {
  }

  renderAll(ctx: CanvasRenderingContext2D) {
    this._tiledMap.coliders.items.forEach((value, index) => {
      const position = this._tiledMap.convertMapNumberToPosition(index)
      this.putOrClearChipToCanvas(ctx, value, position.x, position.y)
    })
  }

  putOrClearChipToCanvas(ctx: CanvasRenderingContext2D, coliderType: ColiderTypes, chipX: number, chipY: number, isTemporaryRendering: boolean = false) {
    if (coliderType === 1) {
      this._putToCanvas(ctx, chipX, chipY)
    } else {
      this._clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering)
    }
  }

  private _clearChipToCanvas(ctx: CanvasRenderingContext2D, chipX: number, chipY: number, isTemporaryRendering: boolean) {
    const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY)

    ctx.clearRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight)

    if (isTemporaryRendering) {
      ctx.fillStyle = `rgba(${this._backgroundRgba.r},${this._backgroundRgba.g},${this._backgroundRgba.b},${this._backgroundRgba.a})`
      ctx.fillRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight)
    }
  }

  private _putToCanvas(ctx: CanvasRenderingContext2D, chipX: number, chipY: number) {
    const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY)

    ctx.clearRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.fillRect(
      position.x,
      position.y,
      this._tiledMap.chipWidth,
      this._tiledMap.chipHeight
    )
  }
}
