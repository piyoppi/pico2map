export type MapChipImageProperties = {
  src: string,
  id: number
}

export class MapChipImage {
  private _image: HTMLImageElement = new Image()
  private _hasImage = false

  constructor(
    private _src: string,
    private _id: number
  ) {
    this.loadImage()
  }

  get id() {
    return this._id
  }

  get src() {
    return this._src
  }

  get hasImage() {
    return this._hasImage
  }

  get image() {
    return this._image
  }

  getChipCount(chipWidth: number, chipHeight: number) {
    if (!this._image) throw new Error('Image loading is not complete.')

    return {
      width: Math.floor(this._image.width / chipWidth),
      height: Math.floor(this._image.height / chipHeight)
    }
  }

  _loadImageHandler() {
    this._hasImage = true
  }

  loadImage() {
    this._image.onload = () => this._loadImageHandler()
    this._image.src = this._src
  }

  waitWhileLoading(): Promise<void> {
    const loadingPromise = new Promise<void>(resolve => {
      this._image.onload = () => {
        this._loadImageHandler()
        resolve()
      }
    })

    if (this._hasImage) return Promise.resolve()

    return loadingPromise
  }

  toObject(): MapChipImageProperties {
    return {
      id: this._id,
      src: this._src
    }
  }

  static fromObject(val: MapChipImageProperties): MapChipImage {
    return new MapChipImage(val.src, val.id)
  }
}

export type MapChipCollectionProperties = {
  items: Array<MapChipImageProperties>
}

export class MapChipsCollection {
  private _items: Map<number, MapChipImage> = new Map()

  push(item: MapChipImage) {
    this._items.set(item.id, item)
  }

  findById(chipId: number) {
    return this._items.get(chipId) || null
  }

  toObject(): MapChipCollectionProperties {
    const objectedMapChipImage: Array<MapChipImageProperties> = []
    const valuesItr = this._items.values()

    for(const val of valuesItr) {
      objectedMapChipImage.push(val.toObject())
    }
    return {
      items: objectedMapChipImage
    }
  }

  fromObject(val: MapChipCollectionProperties): void {
    this._items.clear()

    val.items.forEach(objectedVal => {
      this.push(MapChipImage.fromObject(objectedVal))
    })
  }
}
