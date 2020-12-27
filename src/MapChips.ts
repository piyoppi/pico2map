export class MapChipImage {
  private _image: HTMLImageElement | null = null
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

  get image() {
    if (!this._hasImage) return null
    return this._image
  }

  loadImage() {
    this._image = new Image()
    this._image.onload = () => this._hasImage = true
    this._image.src = this._src
  }
}

export class MapChipsCollection {
  private _items: Map<number, MapChipImage> = new Map()

  public push(item: MapChipImage) {
    this._items.set(item.id, item)
  }

  public findById(chipId: number) {
    return this._items.get(chipId)
  }
}
