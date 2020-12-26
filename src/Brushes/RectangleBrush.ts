import { Brush, BrushPaint, BrushDescription } from './Brush'

export const RectangleBrushDescription: BrushDescription = {
  name: 'RectangleBrush',
  create: () => new RectangleBrush()
}

export class RectangleBrush implements Brush {
  private _isMouseDown = false
  private _startPosition = {x: 0, y: 0}

  mouseDown(chipX: number, chipY: number) {
    this._isMouseDown = true
    this._startPosition = {x: chipX, y: chipY}
  }

  mouseMove(chipX: number, chipY: number): Array<BrushPaint> {
    if (!this._isMouseDown) return []

    return this._build(chipX, chipY)
  }

  mouseUp(chipX: number, chipY: number): Array<BrushPaint> {
    this._isMouseDown = false

    return this._build(chipX, chipY)
  }

  private _build(chipX: number, chipY: number) {
    const paint: Array<BrushPaint> = []
    const startX = Math.min(this._startPosition.x, chipX)
    const startY = Math.min(this._startPosition.y, chipY)
    const endX = Math.max(this._startPosition.x, chipX)
    const endY = Math.max(this._startPosition.y, chipY)

    for(let x = startX; x <= endX; x++ ) {
      for(let y = startY; y <= endY; y++ ) {
        paint.push({x, y})
      }
    }

    return paint
  }

  cleanUp() {
  }
}
