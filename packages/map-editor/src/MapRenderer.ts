import { TiledMap, MapChipFragment, MapChip } from '@piyoppi/pico2map-tiled'

export class MapRenderer {
  private _backgroundRgba = {r: 255, g: 255, b: 255, a: 1.0}

  constructor(
    private _tiledMap: TiledMap
  ) {
  }

  setTiledMap(tiledMap: TiledMap) {
    this._tiledMap = tiledMap
  }

  renderAll(ctx: CanvasRenderingContext2D) {
    this._tiledMap.data.items.forEach((value, index) => {
      const position = this._tiledMap.data.convertMapNumberToPosition(index)
      this.putOrClearChipToCanvas(ctx, value, position.x, position.y)
    })
  }

  putOrClearChipToCanvas(ctx: CanvasRenderingContext2D, mapChip: MapChip | null, chipX: number, chipY: number, isTemporaryRendering: boolean = false) {
    if (!mapChip) {
      this._clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering)
    } else {
      mapChip.items.forEach(item => {
        this._putChipToCanvas(ctx, item, chipX, chipY)
      })
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

  private _putChipToCanvas(ctx: CanvasRenderingContext2D, mapChip: MapChipFragment, chipX: number, chipY: number) {
    const mapChips = this._tiledMap.mapChipsCollection.findById(mapChip.chipId)
    const image = mapChips?.image
    if (!image) return

    const renderingArea = this._getRenderingArea(mapChip)
    const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY)
    position.x += renderingArea.destOffsetX
    position.y += renderingArea.destOffsetY

    ctx.clearRect(position.x, position.y, renderingArea.width, renderingArea.height)
    ctx.drawImage(
      image,
      renderingArea.x,
      renderingArea.y,
      renderingArea.width,
      renderingArea.height,
      position.x,
      position.y,
      renderingArea.width,
      renderingArea.height
    )
  }

  private _getRenderingArea(mapChip: MapChipFragment) {
    const width = this._tiledMap.chipWidth
    const height = this._tiledMap.chipHeight
    const x = mapChip.x * width
    const y = mapChip.y * height

    if (mapChip.renderingArea === 15) {
      return {x, y, width, height, destOffsetX: 0, destOffsetY: 0}
    }

    const halfWidth = Math.round(width / 2)
    const halfHeight = Math.round(height / 2)

    switch(mapChip.renderingArea) {
      case 1:
        return {x, y, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: 0}
      case 2:
        return {x: x + halfWidth, y, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: 0}
      case 3:
        return {x, y, width, height: halfHeight, destOffsetX: 0, destOffsetY: 0}
      case 4:
        return {x, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight}
      case 5:
        return {x, y, width: halfWidth, height, destOffsetX: 0, destOffsetY: 0}
      case 8:
        return {x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: halfHeight}
      case 10:
        return {x: x + halfWidth, y, width: halfWidth, height, destOffsetX: halfWidth, destOffsetY: 0}
      case 12:
        return {x, y: y + halfHeight, width, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight}
    }
  }

}
