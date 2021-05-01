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

export type DetectedState = {
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

  getOverlapped(item: ColidedObject): DetectedState {
    const itemRect = {
      x1: item.x,
      x2: item.x + item.width,
      y1: item.y,
      y2: item.y + item.height
    }
    const colidedPositions = this.detect(item)

    if (colidedPositions.length === 0) return {dx: 0, dy: 0}

    const result: DetectedState = {dx: this._chipWidth, dy: this._chipHeight}

    colidedPositions.forEach(position => {
      result.dx = [
        itemRect.x1 - position.x * this._chipWidth,
        itemRect.x1 - (position.x + 1) * this._chipWidth,
        itemRect.x2 - position.x * this._chipWidth,
        itemRect.x2 - (position.x + 1) * this._chipWidth,
        result.dx
      ].reduce((acc, val) => Math.abs(acc) < Math.abs(val) ? acc : val)

      result.dy = [
        itemRect.y1 - position.y * this._chipHeight,
        itemRect.y1 - (position.y + 1) * this._chipHeight,
        itemRect.y2 - position.y * this._chipHeight,
        itemRect.y2 - (position.y + 1) * this._chipHeight,
        result.dy
      ].reduce((acc, val) => Math.abs(acc) < Math.abs(val) ? acc : val)
    })

    if (Math.abs(result.dx) > this._chipWidth / 2) result.dx = 0
    if (Math.abs(result.dy) > this._chipHeight / 2) result.dy = 0

    return result
  }
}
