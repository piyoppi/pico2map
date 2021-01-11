import { Brush, BrushPaint, BrushDescription } from './Brush'
import { Arrangement } from './Arrangements/Arrangement'
import { DefaultArrangement } from './Arrangements/DefaultArrangement'

export const PenDescription: BrushDescription = {
  name: 'Pen',
  create: () => new Pen()
}

export class Pen implements Brush {
  private _isMouseDown = false
  private painting: Array<BrushPaint> = []
  private _beforeCursorPosition = {x: -1, y: -1}
  private _arrangement: Arrangement = new DefaultArrangement()

  setArrangement(arrangement: Arrangement) {
    this._arrangement = arrangement
  }

  mouseDown(chipX: number, chipY: number) {
    this._isMouseDown = true
    this.painting = []
  }

  mouseMove(chipX: number, chipY: number): Array<BrushPaint> {
    if (!this._isMouseDown) return []

    const paint = {
      x: chipX,
      y: chipY,
      chip: null
    }

    if (paint.x !== this._beforeCursorPosition.x || paint.y !== this._beforeCursorPosition.y) {
      this.painting.push(paint)
      this._beforeCursorPosition = paint
    }

    return this._arrangement.apply(this.painting)
  }

  mouseUp(chipX: number, chipY: number): Array<BrushPaint> {
    this._isMouseDown = false
    return this._arrangement.apply(this.painting)
  }

  cleanUp() {
    this.painting.length = 0
    this._beforeCursorPosition = {x: -1, y: -1}
  }
}
