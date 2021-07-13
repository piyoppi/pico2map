import { MapChipsCollection } from '../src/MapChipsCollection'
import { MapChipImage } from '../src/MapChipImage'

describe('remove', () => {
  it('Should remove a mapChip', () => {
    const collection = new MapChipsCollection()
    const mapChipImage = new MapChipImage('dummy.png', 1)

    collection.push(mapChipImage)
    expect(collection.findById(mapChipImage.id)).toEqual(mapChipImage)

    collection.remove(mapChipImage)
    expect(collection.findById(mapChipImage.id)).toEqual(null)
  })
})

describe('push', () => {
  it('Should add a mapChip', () => {
    const collection = new MapChipsCollection()
    const mapChipImage = new MapChipImage('dummy.png', 1)

    collection.push(mapChipImage)
    expect(collection.findById(mapChipImage.id)).toEqual(mapChipImage)
  })
})

describe('findById', () => {
  it('Should return a mapChip', () => {
    const collection = new MapChipsCollection()
    const mapChipImage1 = new MapChipImage('dummy1.png', 1)
    const mapChipImage2 = new MapChipImage('dummy2.png', 2)

    collection.push(mapChipImage1)
    collection.push(mapChipImage2)
    expect(collection.findById(mapChipImage1.id)).toEqual(mapChipImage1)
    expect(collection.findById(mapChipImage2.id)).toEqual(mapChipImage2)
  })

  it('Should return null value when mapChip is not registered', () => {
    const collection = new MapChipsCollection()

    expect(collection.findById(0)).toEqual(null)
  })
})

describe('getItems', () => {
  it('Should return an array including all MapChipImages', () => {
    const collection = new MapChipsCollection()
    const mapChipImage1 = new MapChipImage('dummy1.png', 1)
    const mapChipImage2 = new MapChipImage('dummy2.png', 2)

    collection.push(mapChipImage1)
    collection.push(mapChipImage2)

    expect(collection.getItems()).toEqual([mapChipImage1, mapChipImage2])
  })
})

describe('replace', () => {
  it('Should throw an error when target MapChipImage is not found', () => {
    const collection = new MapChipsCollection()
    const mapChipImage1 = new MapChipImage('dummy1.png', 1)
    collection.push(mapChipImage1)

    const mapChipImageReplaced = new MapChipImage('dummy2.png', 2)

    expect(() => collection.replace(mapChipImageReplaced)).toThrow()
  })

  it('Should be replaced MapChipImage', () => {
    const collection = new MapChipsCollection()

    const mapChipImage1 = new MapChipImage('dummy1.png', 1)
    const mapChipImage2 = new MapChipImage('dummy2.png', 2)
    collection.push(mapChipImage1)
    collection.push(mapChipImage2)

    const mapChipImageReplaced = new MapChipImage('dummy1-new.png', 1)

    collection.replace(mapChipImageReplaced)
    expect(collection.getItems()).toEqual([mapChipImage2, mapChipImageReplaced])
  })
})
