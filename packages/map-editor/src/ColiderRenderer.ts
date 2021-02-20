import { TiledMap, MapChipFragment, MapChip, ColiderTypes } from '@pico2map/tiled-map'

export class ColiderRenderer {
  private _backgroundRgba = {r: 255, g: 255, b: 255, a: 1.0}

  constructor(
    private _tiledMap: TiledMap
  ) {
  }

  renderAll(ctx: CanvasRenderingContext2D) {
    this._tiledMap.coliders.items.forEach((value, index) => {
      const position = this._tiledMap.data.convertMapNumberToPosition(index)
      this.putOrClearChipToCanvas(ctx, value, position.x, position.y)
    })
  }

  putOrClearChipToCanvas(ctx: CanvasRenderingContext2D, coliderType: ColiderTypes, chipX: number, chipY: number, isTemporaryRendering: boolean = false) {
    if (coliderType === 'colider') {
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
