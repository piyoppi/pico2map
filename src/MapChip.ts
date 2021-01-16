export interface MapChipComparable {
  identifyKey: string
  compare(others: MapChipComparable): boolean
}

export type Boundary = {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean,
}

export type Cross = {
  topLeft: boolean,
  topRight: boolean,
  bottomLeft: boolean,
  bottomRight: boolean
}

export type MapChipRenderingArea = 1 | 2 | 3 | 4 | 5 | 8 | 10 | 12 | 15

export class MapChipFragment implements MapChipComparable {
  private _identifyKey = ''
  private _boundary: Boundary = {
    top: false,
    bottom: false,
    left: false,
    right: false
  }
  private _cross : Cross = {
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false
  }

  constructor(
    private _x: number,
    private _y: number,
    private _chipId: number,
    /**
     *  _renderingArea indicates the area where this map-chip is to be drawn.
     *  It is represented by a OR of the following area-numbers.
     *
     * |<- 1chip ->|
     * *-----*-----* ---
     * |  1  |  2  |  ↑
     * *-----*-----* 1chip
     * |  4  |  8  |  ↓
     * *-----*-----* ---
     */
    private _renderingArea :MapChipRenderingArea = 15
  ) {
    this._identifyKey = `${_x},${_y},${_chipId}`
  }

  get boundary() {
    return this._boundary
  }

  get cross() {
    return this._cross
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get chipId() {
    return this._chipId
  }

  get identifyKey() {
    return this._identifyKey
  }

  get renderingArea() {
    return this._renderingArea
  }

  setBoundary(boundary: Boundary) {
    this._boundary = boundary
  }

  setCross(cross: Cross) {
    this._cross = cross
  }

  withParameter(parameters: {x?: number, y?: number, renderingArea?: MapChipRenderingArea}) {
    if (parameters.x) this._x = parameters.x
    if (parameters.y) this._y = parameters.y
    if (parameters.renderingArea) this._renderingArea = parameters.renderingArea

    return this
  }

  clone() {
    return new MapChipFragment(this._x, this._y, this._chipId)
  }

  compare(others: MapChipComparable) {
    return this.identifyKey === others.identifyKey
  }
}

export class MapChip implements MapChipComparable {
  private _identifyKey = ''

  constructor(
    private _items: Array<MapChipFragment> = [],
    private _boundary: Boundary = {
      top: false,
      bottom: false,
      left: false,
      right: false
    },
    private _cross: Cross = {
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false
    }
  ) {
    this._buildIdentifyKey()
  }

  get items() {
    return this._items
  }

  get identifyKey() {
    return this._identifyKey
  }

  get boundary() {
    return this._boundary
  }

  get cross() {
    return this._cross
  }

  get length() {
    return this._items.length
  }

  private _buildIdentifyKey() {
    this._identifyKey = this._items.map(item => item.identifyKey).join('|')
  }

  setBoundary(boundary: Boundary) {
    this._boundary = boundary
  }

  setCross(cross: Cross) {
    this._cross = cross
  }

  push(mapChip: MapChipFragment) {
    this._items.push(mapChip)
    this._buildIdentifyKey()
  }

  clear() {
    this._items.length = 0
    this._buildIdentifyKey()
  }

  clone() {
    const cloned = new MapChip()
    cloned._items = this._items.map(mapChip => mapChip.clone())

    return cloned
  }

  compare(others: MapChipComparable) {
    return this.identifyKey === others.identifyKey
  }
}
