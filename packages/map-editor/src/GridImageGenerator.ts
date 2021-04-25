export class GridImageGenerator {
  private _width = 0
  private _height = 0
  private _changed = false
  private _color = '#000000'

  get changed() {
    return this._changed
  }

  get gridColor() {
    return this._color
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  set gridColor(color: string) {
    this._changed = this._color !== color
    this._color = color
  }

  setGridSize(width: number, height: number) {
    this._changed = (this._width !== width) || (this._height !== height)
    this._width = width
    this._height = height
  }

  generateDottedPart(): HTMLCanvasElement {
    const {canvas, context} = this.createCanvas()

    context.fillRect(this._width - 1, this._height - 1, 1, 1)

    return canvas
  }

  generateLinePart(): HTMLCanvasElement {
    const {canvas, context} = this.createCanvas()

    context.fillRect(0, this._height - 1, this._width, 1)
    context.fillRect(this._width - 1, 0, 1, this._height)

    return canvas
  }

  private createCanvas(): {canvas: HTMLCanvasElement, context: CanvasRenderingContext2D} {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if( !context ) {
      throw new Error()
    }

    canvas.width = this._width
    canvas.height = this._height

    context.fillStyle = this._color

    return {
      canvas,
      context
    }
  }
}
