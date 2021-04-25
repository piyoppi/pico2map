export class GridImageGenerator {
  private width = 0
  private height = 0
  private _changed = false
  private _color = '#000000'

  get changed() {
    return this._changed
  }

  get gridColor() {
    return this._color
  }

  set gridColor(color: string) {
    this._changed = this._color !== color
    this._color = color
  }

  setGridSize(width: number, height: number) {
    this._changed = (this.width !== width) || (this.height !== height)
    this.width = width
    this.height = height
  }

  generateDottedPart(): HTMLCanvasElement {
    const {canvas, context} = this.createCanvas()

    context.fillRect(this.width - 1, this.height - 1, 1, 1)

    return canvas
  }

  generateLinePart(): HTMLCanvasElement {
    const {canvas, context} = this.createCanvas()

    context.fillRect(0, this.height - 1, this.width, 1)
    context.fillRect(this.width - 1, 0, 1, this.height)

    return canvas
  }

  private createCanvas(): {canvas: HTMLCanvasElement, context: CanvasRenderingContext2D} {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if( !context ) {
      throw new Error()
    }

    canvas.width = this.width
    canvas.height = this.height

    context.fillStyle = this._color

    return {
      canvas,
      context
    }
  }
}
