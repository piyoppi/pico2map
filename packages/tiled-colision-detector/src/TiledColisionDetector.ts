/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

export interface TiledColisionDetectable {
  getFromChipPosition: (x: number, y: number) => ColiderTypes
}

export interface ColidedObject {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type ColiderTypes = 0 | 1

export type OverlappingAmount = {
  dx: number,
  dy: number,
  dxMax: number,
  dyMax: number
}

export type PositionDiff = {
  dx: number,
  dy: number
}

type Position = {x: number, y: number}

export class TiledColisionDetector {
  constructor(
    private _data: TiledColisionDetectable,
    private _chipWidth: number,
    private _chipHeight: number
  ) {
    
  }

  detect(item: ColidedObject) {
    const colidedTilePositions: Array<Position> = []
    const itemRect = {
      x1: item.x,
      x2: item.x + item.width,
      y1: item.y,
      y2: item.y + item.height
    }
    const chipPositionOfItem = {
      x1: Math.floor(itemRect.x1 / this._chipWidth),
      x2: Math.floor((itemRect.x2 - 1) / this._chipWidth),
      y1: Math.floor(itemRect.y1 / this._chipHeight),
      y2: Math.floor((itemRect.y2 - 1) / this._chipHeight),
    }

    for( let y = chipPositionOfItem.y1; y <= chipPositionOfItem.y2; y++ ) {
      for( let x = chipPositionOfItem .x1; x <= chipPositionOfItem.x2; x++ ) {
        if (this._data.getFromChipPosition(x, y) !== 0) {
          colidedTilePositions.push({x, y})
        }
      }
    }

    return colidedTilePositions
  }

  getOverlapped(item: ColidedObject): OverlappingAmount {
    const colidedPositions = this.detect(item)

    const overlapped: OverlappingAmount = {
      dx: this._chipWidth,
      dy: this._chipHeight,
      dxMax: 0,
      dyMax: 0,
    }

    if (colidedPositions.length === 0) return {...overlapped, dx: 0, dy: 0}

    const overlappedThresholdX = (item.width + this._chipWidth) / 2
    const overlappedThresholdY = (item.height + this._chipHeight) / 2

    colidedPositions.forEach(position => {
      const chipPositionPixeled = {
        x: position.x * this._chipWidth,
        y: position.y * this._chipHeight
      }
      const dx = item.x + (item.width / 2) - (chipPositionPixeled.x + (this._chipWidth / 2))
      const dy = item.y + (item.height / 2)  - (chipPositionPixeled.y + (this._chipHeight / 2))
      const absdx = Math.abs(dx)
      const absdy = Math.abs(dy)
      const overlappedX = (overlappedThresholdX - absdx) * (dx < 0 ? -1 : 1)
      const overlappedY = (overlappedThresholdY - absdy) * (dy < 0 ? -1 : 1)
      const absOverlappedX = Math.abs(overlappedX)
      const absOverlappedY = Math.abs(overlappedY)

      if (absOverlappedX < Math.abs(overlapped.dx)) {
        overlapped.dx = overlappedX
      }

      if (absOverlappedX > Math.abs(overlapped.dxMax)) {
        overlapped.dxMax = overlappedX
      }

      if (absOverlappedY < Math.abs(overlapped.dy)) {
        overlapped.dy = overlappedY
      }

      if (absOverlappedY > Math.abs(overlapped.dyMax)) {
        overlapped.dyMax = overlappedY
      }
    })

    if (overlapped.dx === this._chipWidth) overlapped.dx = 0
    if (overlapped.dy === this._chipHeight) overlapped.dy = 0

    return overlapped
  }

  solveOverlapped(item: ColidedObject, limit: number = 2): PositionDiff {
    const clonedItem = {...item}

    for(let i=0; i<limit; i++) {
      const overlapped = this.getOverlapped(clonedItem)
      if (overlapped.dx === 0 && overlapped.dy === 0) break

      if (Math.abs(overlapped.dxMax) > Math.abs(overlapped.dyMax)) {
        clonedItem.y += overlapped.dy
      } else if (Math.abs(overlapped.dxMax) < Math.abs(overlapped.dyMax)) {
        clonedItem.x += overlapped.dx
      } else {
        clonedItem.y += overlapped.dy
      }
    }

    return {dx: clonedItem.x - item.x, dy: clonedItem.y - item.y}
  }
}
