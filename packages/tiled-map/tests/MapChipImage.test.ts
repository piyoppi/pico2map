import { MapChipImage } from '../src/MapChipImage'

class DummyImage {
  protected _onload = () => {}
  protected _onerror = () => {}
  protected _src = ''

  constructor(_width?: number, _height?: number) {}

  set src(value: string) {
    this._src = value
    this._onload()
  }
  get src() { return this._src }
  set onload(value: () => void) { this._onload = value }
  set onerror(value: () => void) { this._onerror = value }

  get width() { return 100 }
  get height() { return 128 }
}

describe('waitWhileLoading', () => {
  it('Should return resolved promise when the image is loaded', () => {
    Object.defineProperty(window, 'Image', {
      value: DummyImage
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    return expect(image.waitWhileLoading()).resolves.toEqual(undefined)
  })

  it('Should return rejected promise when the image failed to load', () => {
    Object.defineProperty(window, 'Image', {
      value: class extends DummyImage {
        set src(_: string) { this._onerror() }
      }
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    return expect(image.waitWhileLoading()).rejects.toThrow('Failed to load the image.')
  })

  it('Should return resolved promise when waitForLoading() executed while the image is loading', () => {
    Object.defineProperty(window, 'Image', {
      value: class extends DummyImage {
        set src(_: string) { setTimeout(() => this._onload(), 500) }
      }
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    return expect(image.waitWhileLoading()).resolves.toEqual(undefined)
  })

  it('Should return rejected promise when waitForLoading() executed while the image is loading', () => {
    Object.defineProperty(window, 'Image', {
      value: class extends DummyImage {
        set src(_: string) { setTimeout(() => this._onerror(), 500) }
      }
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    return expect(image.waitWhileLoading()).rejects.toThrow('Failed to load the image.')
  })
})

describe('getChipCount', () => {
  it('Should throw an error when image is not loaded', () => {
    Object.defineProperty(window, 'Image', {
      value: class extends DummyImage {
        set src(_: string) { }
      }
    })
    const image = new MapChipImage('dummy.png', 1)
    
    return expect(() => image.getChipCount(32, 32)).toThrow('Image loading is not complete.')
  })

  it('Should return chip count', () => {
    Object.defineProperty(window, 'Image', {
      value: DummyImage
    })
    const image = new MapChipImage('dummy.png', 1)

    return expect(image.getChipCount(32, 32)).toEqual({width: 3, height: 4})
  })
})

describe('loadImage', () => {
  it('Should load an image', () => {
    Object.defineProperty(window, 'Image', {
      value: DummyImage
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    expect(image.src).toEqual('dummy.png')
    expect(image.hasImage).toEqual(true)
  })

  it('Should set error state when loading the image is failed', () => {
    Object.defineProperty(window, 'Image', {
      value: class extends DummyImage {
        set src(_: string) { this._onerror() }
      }
    })

    const image = new MapChipImage('dummy.png', 1)

    image.loadImage()
    expect(image.hasError).toEqual(true)
  })
})
