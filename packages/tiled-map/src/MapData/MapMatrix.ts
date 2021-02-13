export class MapMatrix<T> {
  constructor(
    protected _chipCountX: number,
    protected _chipCountY: number,
    protected _items: Array<T> = []
  ) {
    if (this._items.length > 0 && this.size !== this._items.length) {
      throw new Error()
    }

    if (this._items.length === 0) this.allocate()
  }

  get size() {
    return this._chipCountX * this._chipCountY
  }

  get width() {
    return this._chipCountX
  }

  get height() {
    return this._chipCountY
  }

  get items() {
    return this._items
  }

  set(items: Array<T>) {
    if (items.length !== this._items.length) throw new Error()

    this._items = items
  }

  transferFromTiledMapData(src: MapMatrix<T>, srcX: number, srcY: number, width: number, height: number, destX: number, destY: number) {
    for(let x = 0; x < width; x++) {
      const putX = destX + x
      const pickupX = srcX + x
      if (putX < 0 || putX >= this.width) continue;
      if (pickupX < 0 || pickupX >= src.width) continue;

      for(let y = 0; y < height; y++) {
        const putY = destY + y
        const pickupY = srcY + y
        if (putY < 0 || putY >= this.height) continue;
        if (pickupY < 0 || pickupY >= src.height) continue;

        const item = src.getFromChipPosition(pickupX, pickupY)

        this.put(item, putX, putY)
      }
    }
  }

  getFromChipPosition(x: number, y: number): T {
    if ((x < 0)  || (y < 0) || (x >= this._chipCountX) || (y >= this._chipCountY)) throw new Error('The position is out of range.')

    const mapNumber = this.convertPositionToMapNumber(x, y)
    return this._items[mapNumber]
  }

  put(item: T, x: number, y: number) {
    const mapNumber = this.convertPositionToMapNumber(x, y)
    this._items[mapNumber] = item 
  }

  convertPositionToMapNumber(x: number, y: number) {
    return y * this._chipCountX + x
  }

  convertMapNumberToPosition(num: number) {
    return {
      x: num % this._chipCountY,
      y: Math.floor(num / this._chipCountY)
    }
  }

  protected allocate(defaultValue: T | null = null) {
    this._items = new Array(this._chipCountY * this._chipCountX).fill(null)
  }
}
