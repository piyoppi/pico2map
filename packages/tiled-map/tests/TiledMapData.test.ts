import { TiledMapData } from './../src/MapData/TiledMapData'
import { MapChip, MapChipFragment } from './../src/MapChip'

describe('#filter', () => {
  it('Return filtered map data', () => {
    const data = new TiledMapData(3, 3)
    const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
    const c2 = new MapChip([new MapChipFragment(2, 0, 0)])
    const source = [
      c1, null,   c2,
      c2,   c2,   c1,
      c1, null,   c1,
    ]
    data.set(source)

    const filtered = data.filter([c1])
    expect(filtered.items).toEqual([
        c1, null, null,
      null, null,   c1,
        c1, null,   c1,
    ])
  })
})
