import { transferEach } from './TransferEach'
import { MapMatrix } from './MapMatrix'
import { MapChipComparable } from '../MapChip'

type MapPaletteMatrixItem = MapChipComparable | null

export class MapPaletteMatrix {
  private _paletteIndexes: Map<string, number> = new Map()

  constructor(
    chipCountX: number,
    chipCountY: number,
    items: Array<MapPaletteMatrixItem> = [],
    private _palette: Array<MapPaletteMatrixItem> = [],
    private _values = new MapMatrix<number>(chipCountX, chipCountY, new Array(chipCountY * chipCountX).fill(-1))
  ) {
    if (items.length > 0) {
      this.set(items)
    }
  }

  get size() {
    return this._values.size
  }

  get width() {
    return this._values.width
  }

  get height() {
    return this._values.height
  }

  get items() {
    return this._values.items.map(value => value >= 0 ? this._palette[value] : null)
  }

  get palette() {
    return this._palette
  }

  get values() {
    return this._values
  }

  set(items: Array<MapPaletteMatrixItem>) {
    if (items.length !== this._values.items.length) throw new Error()

    this._values.set(items.map(value => this._getPaletteIndexFromValue(value)))
  }

  setValuePalette(values: Array<number>, palette: Array<MapPaletteMatrixItem>) {
    if (values.length !== this._values.items.length) throw new Error()

    this._values.set(values)
    this._palette = palette
  }

  transferFromTiledMapData(src: MapPaletteMatrix, srcX: number, srcY: number, width: number, height: number, destX: number, destY: number) {
    transferEach(
      srcX, srcY, width, height, destX, destY,
      src.width, src.height, this.width, this.height,
      (pickupX, pickupY, putX, putY) => {
        const item = src.getFromChipPosition(pickupX, pickupY)
        this._values.put(this._getPaletteIndexFromValue(item), putX, putY)
      }
    )
  }

  resize(chipCountX: number, chipCountY: number, emptyValue: MapPaletteMatrixItem) {
    this._values.resize(chipCountX, chipCountY, this._getPaletteIndexFromValue(emptyValue))
  }

  getFromChipPosition(x: number, y: number): MapPaletteMatrixItem {
    const paletteIndex = this._values.getFromChipPosition(x, y)

    return paletteIndex >= 0 ? this._palette[paletteIndex] : null
  }

  put(item: MapPaletteMatrixItem, x: number, y: number) {
    this._values.put(this._getPaletteIndexFromValue(item), x, y)
  }

  clone() {
    const cloned = new MapPaletteMatrix(this.width, this.height)
    cloned.setValuePalette(this._values.items, this._palette)

    return cloned
  }

  private _getPaletteIndexFromValue(value: MapPaletteMatrixItem): number {
    if (value === null) return -1

    const index = this._paletteIndexes.get(value.identifyKey)
    if (index !== undefined) return index

    this._palette.push(value)

    const addedIndex = this._palette.length - 1
    this._paletteIndexes.set(value.identifyKey, addedIndex)

    return addedIndex
  }
}
