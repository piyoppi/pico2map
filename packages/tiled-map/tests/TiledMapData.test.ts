import { TiledMapData } from './../src/MapData/TiledMapData'
import { MapChip, MapChipFragment } from './../src/MapChip'

const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
const c2 = new MapChip([new MapChipFragment(2, 0, 0)])
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
