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
}

export class MapChipsCollection {
  private _items: Map<number, MapChipImage> = new Map()

  public push(item: MapChipImage) {
    this._items.set(item.id, item)
  }

  public findById(chipId: number) {
    return this._items.get(chipId) || null
  }
}
