import { Brush, BrushPaint, BrushDescription } from './Brush'

export const PenDescription: BrushDescription = {
  name: 'Pen',
  create: () => new Pen()
}

export class Pen implements Brush {
  private _isMouseDown = false
  private painting: Array<BrushPaint> = []
  private _beforeCursorPosition = {x: -1, y: -1}

  mouseDown(chipX: number, chipY: number) {
    this._isMouseDown = true
    this.painting = []
  }

  mouseMove(chipX: number, chipY: number): Array<BrushPaint> {
    if (!this._isMouseDown) return []

    const paint = {
      x: chipX,
      y: chipY
    }

    if (paint.x !== this._beforeCursorPosition.x || paint.y !== this._beforeCursorPosition.y) {
      this.painting.push(paint)
      this._beforeCursorPosition = paint
    }

    return this.painting
  }

  mouseUp(chipX: number, chipY: number): Array<BrushPaint> {
    this._isMouseDown = false
    return this.painting
  }

  cleanUp() {
    this.painting.length = 0
    this._beforeCursorPosition = {x: -1, y: -1}
  }
}
