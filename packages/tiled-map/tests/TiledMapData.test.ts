import { TiledMapData } from './../src/MapData/TiledMapData'
import { MapChip, MapChipFragment } from './../src/MapChip'
import { MapChipImage } from '../src/MapChipImage'

const image1 = new MapChipImage('dummy1.png', 1)
const image2 = new MapChipImage('dummy2.png', 2)
const image3 = new MapChipImage('dummy3.png', 3)
const c1 = new MapChip([new MapChipFragment(0, 0, image1.id)])
const c2 = new MapChip([new MapChipFragment(1, 0, image2.id)])
const c3 = new MapChip([new MapChipFragment(2, 0, image1.id)])
const c4 = new MapChip([new MapChipFragment(3, 0, image2.id)])
const source = [
  c1, null,   c2,
  c2,   c2,   c1,
  c1, null,   c1,
]

describe('#filter', () => {
  it('Return filtered map data', () => {
    const data = new TiledMapData(3, 3)
    data.set(source)

    const filtered = data.filter([c1])
    expect(filtered.items).toEqual([
      c1, null, null,
      null, null,   c1,
      c1, null,   c1,
    ])
  })
})

describe('#toObject', () => {
  it('Should return a serialized object', () => {
    const data = new TiledMapData(3, 3)
    data.set(source)

    expect(data.toObject()).toEqual({
      chipCountX: 3,
      chipCountY: 3,
      values: [
        0, -1, 1,
        1,  1, 0,
        0, -1, 0
      ],
      palette: [c1.toObject(), c2.toObject()]
    })
  })
})

describe('#fromObject', () => {
  it('Should return a deserialized value', () => {
    const data = new TiledMapData(3, 3)
    data.set(source)
    const serialized = data.toObject()

    const deserialized = TiledMapData.fromObject(serialized)
    expect(deserialized.width).toEqual(3)
    expect(deserialized.height).toEqual(3)
    expect(deserialized.values.items).toEqual([
      0, -1, 1,
      1,  1, 0,
      0, -1, 0
    ])
    expect(deserialized.palette).toEqual([c1, c2])
  })
})

describe('#removeMapChip', () => {
  it('Should remove mapChip from palette and values', () => {
    const data = new TiledMapData(3, 3)
    data.set([
      c1, null,   c2,
      c2,   c2,   c1,
      c1, null,   c3,
    ])

    data.removeMapChip(c1)
    expect(data.palette).toEqual([c2, c3])
    expect(data.values.items).toEqual([
      -1, -1,  0,
       0,  0, -1,
      -1, -1,  1
    ])
  })
})

describe('getMapChipsFromImage', () => {
  it('Should return mapChips with a specific image', () => {
    const data = new TiledMapData(3, 3)
    data.set([
      c1, null,   c2,
      c2,   c2,   c1,
      c1, null,   c3,
    ])

    expect(data.getMapChipsFromImage(image1)).toEqual([c1, c3])
    expect(data.getMapChipsFromImage(image2)).toEqual([c2])
    expect(data.getMapChipsFromImage(image3)).toEqual([])
  })
})

describe('removeMapChipsFromImage', () => {
  it('Should remove mapChips with a specific image', () => {
    const data = new TiledMapData(3, 3)
    data.set([
      c1, null,   c2,
      c2,   c2,   c1,
      c1,   c4,   c3,
    ])

    data.removeMapChipsFromImage(image1)

    expect(data.palette).toEqual([c2, c4])
    expect(data.values.items).toEqual([
      -1, -1,  0,
       0,  0, -1,
      -1,  1, -1
    ])
  })
})
