export type MapChipImageProperties = {
  src: string,
  id: number
}

export class MapChipImage {
  private _image: HTMLImageElement = new Image()
  private _hasImage = false
  private _hasError = false

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

  get hasError() {
    return this._hasError
  }

  get image() {
    return this._image
  }

  getChipCount(chipWidth: number, chipHeight: number) {
    if (!this._hasImage) throw new Error('Image loading is not complete.')

    return {
      width: Math.floor(this._image.width / chipWidth),
      height: Math.floor(this._image.height / chipHeight)
    }
  }

  private _loadImageHandler() {
    this._hasImage = true
  }

  private _errorImaegHandler() {
    this._hasError = true
  }

  loadImage() {
    this._hasImage = false
    this._hasError = false
    this._image.onload = () => this._loadImageHandler()
    this._image.onerror = () => this._errorImaegHandler()
    this._image.src = this._src
  }

  waitWhileLoading(): Promise<void> {
    const loadingPromise = new Promise<void>((resolve, reject) => {
      this._image.onload = () => {
        this._loadImageHandler()
        resolve()
      }

      this._image.onerror = () => {
        this._errorImaegHandler()
        reject(new Error('Failed to load the image.'))
      }
    })

    if (this._hasImage) return Promise.resolve()
    if (this._hasError) return Promise.reject(new Error('Failed to load the image.'))

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
