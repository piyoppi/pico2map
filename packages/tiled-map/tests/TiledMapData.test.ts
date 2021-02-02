import { TiledMapData } from './../src/TiledMap'
import { MapChip, MapChipFragment } from './../src/MapChip'

describe('#transferFromTiledMapData', () => {
  it('Transfered a source data', () => {
    const srcTiledMapData = new TiledMapData(5, 5)
    const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
    const c2 = new MapChip([new MapChipFragment(2, 0, 0)])
    const expectMapData = [
      c1, c1, c2, c1, c1,
      c1, c2, c2, c2, c1,
      c2, c2, c1, c2, c2,
      c1, c2, c2, c2, c1,
      c1, c1, c2, c1, c1
    ]

    srcTiledMapData.set(expectMapData)

    const destTiledMapData = new TiledMapData(5, 5)

    destTiledMapData.transferFromTiledMapData(srcTiledMapData, 0, 0, 5, 5, 0, 0)

    expect(destTiledMapData.mapData).toEqual(expectMapData)
  })

  it('With clipping', () => {
    const srcTiledMapData = new TiledMapData(5, 5)
    const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
    const c2 = new MapChip([new MapChipFragment(2, 0, 0)])
    const source = [
      c1, c1, c2, c1, c1,
      c1, c2, c2, c2, c1,
      c2, c2, c1, c2, c2,
      c1, c2, c2, c2, c1,
      c1, c1, c2, c1, c1
    ]

    srcTiledMapData.set(source)

    const destTiledMapData = new TiledMapData(5, 5)
    destTiledMapData.transferFromTiledMapData(srcTiledMapData, 1, 1, 3, 3, 2, 1)
    expect(destTiledMapData.mapData).toEqual([
      null, null, null, null, null,
      null, null,   c2,   c2,   c2,
      null, null,   c2,   c1,   c2,
      null, null,   c2,   c2,   c2,
      null, null, null, null, null,
    ])

    const destTiledMapData2 = new TiledMapData(5, 5)
    destTiledMapData2.transferFromTiledMapData(srcTiledMapData, 1, 1, 3, 4, 3, 4)
    expect(destTiledMapData2.mapData).toEqual([
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null,   c2,   c2,
    ])

    const destTiledMapData3 = new TiledMapData(5, 5)
    destTiledMapData3.transferFromTiledMapData(srcTiledMapData, 1, 1, 3, 3, -1, -1)
    expect(destTiledMapData3.mapData).toEqual([
        c1,   c2, null, null, null,
        c2,   c2, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
    ])
  })
})

describe('#put', () => {
  it('Put some MapChips', () => {
    const data = new TiledMapData(3, 3)
    const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
    const c2 = new MapChip([new MapChipFragment(2, 0, 0)])

    data.put(c1, 0, 0)
    data.put(c2, 1, 1)
    data.put(c1, 2, 2)
    data.put(c2, 0, 1)
    data.put(c1, 0, 2)
    data.put(c2, 2, 0)
    data.put(c1, 2, 1)
    expect(data.mapData).toEqual([
      c1, null,   c2,
      c2,   c2,   c1,
      c1, null,   c1,
    ])
  })
})

describe('#getMapDataFromChipPosition', () => {
  it('return a MapChip', () => {
    const data = new TiledMapData(3, 3)
    const c1 = new MapChip([new MapChipFragment(0, 0, 0)])
    const c2 = new MapChip([new MapChipFragment(2, 0, 0)])
    const source = [
      c1, null,   c2,
      c2,   c2,   c1,
      c1, null,   c1,
    ]
    data.set(source)

    expect(data.getMapDataFromChipPosition(0, 0)).toEqual(c1)
    expect(data.getMapDataFromChipPosition(1, 0)).toEqual(null)
    expect(data.getMapDataFromChipPosition(1, 1)).toEqual(c2)
    expect(data.getMapDataFromChipPosition(1, 2)).toEqual(null)
  })
})

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
    expect(filtered.mapData).toEqual([
        c1, null, null,
      null, null,   c1,
        c1, null,   c1,
    ])
  })
})
