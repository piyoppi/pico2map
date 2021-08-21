/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { AutoTile, AutoTiles, MapChipsCollection } from '@piyoppi/pico2map-tiled'

export class AutoTileSelector {
  private _indexImageWidth = 0
  private _indexImageHeight = 0
  private _autoTilesMap: Map<string, AutoTile> = new Map()

  constructor(
    private _canvasWidth: number,
    private _chipWidth: number,
    private _chipHeight: number,
    private _autoTiles: AutoTiles,
    private _mapChipsCollection: MapChipsCollection
  ) {

  }

  get canvasWidth() {
    return this._canvasWidth
  }

  set canvasWidth(value: number) {
    this._canvasWidth = value
  }

  getAutoTileFragmentFromIndexImagePosition(cursorX: number, cursorY: number): AutoTile | null {
    const x = Math.floor(cursorX / this._chipWidth)
    const y = Math.floor(cursorY / this._chipHeight)

    return this._autoTilesMap.get(`${x},${y}`) || null
  }

  convertFromIndexImageToChipPosition(cursorX: number, cursorY: number) {
    const chipCount = {
      width: this._indexImageWidth / this._chipWidth,
      height: this._indexImageHeight / this._chipHeight
    }

    return {
      x: Math.max(0, Math.min(Math.floor(cursorX / this._chipWidth), chipCount.width - 1)),
      y: Math.max(0, Math.min(Math.floor(cursorY / this._chipHeight), chipCount.height - 1))
    }
  }

  getSizeOfIndexImage() {
    return {
      width: this._canvasWidth,
      height: Math.ceil(this._autoTiles.length / Math.floor(this._canvasWidth / this._chipWidth)) * this._chipHeight
    }
  }

  generateIndexImage(canvas: HTMLCanvasElement) {
    const indexImageContext: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (!indexImageContext) return

    indexImageContext.clearRect(0, 0, canvas.width, canvas.height)

    this._autoTilesMap.clear()

    const xCount = Math.floor(this._canvasWidth / this._chipWidth)
    const values = this._autoTiles.values()

    let currentAutoTile: AutoTile | undefined = undefined
    let x = 0, y = 0
    while(currentAutoTile = values.next().value) {
      const fragment = currentAutoTile.mapChipFragments[0]
      const chipImage = this._mapChipsCollection.findById(fragment.chipId)
      if (!chipImage) continue

      indexImageContext.drawImage(
        chipImage.image,
        fragment.x * this._chipWidth,
        fragment.y * this._chipHeight,
        this._chipWidth,
        this._chipHeight,
        x * this._chipWidth,
        y * this._chipHeight,
        this._chipWidth,
        this._chipHeight
      )

      this._autoTilesMap.set(`${x},${y}`, currentAutoTile)

      x++

      if (x >= xCount) {
        x = 0
        y++
      }
    }

    this._indexImageWidth = xCount * this._chipWidth
    this._indexImageHeight = (y + 1) * this._chipHeight
  }
}
