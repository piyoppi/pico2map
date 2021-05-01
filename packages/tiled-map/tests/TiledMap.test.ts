import { TiledMap } from './../src/TiledMap'
import { MapChip, MapChipFragment } from './../src/MapChip'

describe('#convertChipPositionToPixel', () => {
  const tiledMap = new TiledMap(5, 6, 32, 32)

  it('Should return converted position', () => {
    expect(tiledMap.convertChipPositionToPixel(0, 0)).toEqual({x: 0, y: 0})
    expect(tiledMap.convertChipPositionToPixel(2, 0)).toEqual({x: 64, y: 0})
    expect(tiledMap.convertChipPositionToPixel(0, 2)).toEqual({x: 0, y: 64})
    expect(tiledMap.convertChipPositionToPixel(3, 4)).toEqual({x: 96, y: 128})
  })
})

describe('#put', () => {
  const tiledMap = new TiledMap(5, 6, 32, 32)

  it('Should put a map chip', () => {
    const mapChip = new MapChip([new MapChipFragment(1, 1, 1)])

    tiledMap.put(mapChip, 3, 2, 0)
    expect(tiledMap.datas[0].getFromChipPosition(3, 2)).toEqual(mapChip)
  })
})

describe('data', () => {
  const mapSize = {
    width: 10,
    height: 15
  }
  const tiledMap = new TiledMap(mapSize.width, mapSize.height, 32, 32)

  it('Should return map data', () => {
    const actualMapData = tiledMap.datas[0]
    expect(actualMapData.width).toEqual(mapSize.width)
    expect(actualMapData.height).toEqual(mapSize.height)
  })
})

describe('#addLayer', () => {
  const tiledMap = new TiledMap(5, 6, 32, 32)

  it('Should add a layer', () => {
    tiledMap.addLayer()
    expect(tiledMap.datas.length).toEqual(2)
    tiledMap.addLayer()
    expect(tiledMap.datas.length).toEqual(3)
  })
})

describe('#convertMapNumberToPosition', () => {
  const tiledMap = new TiledMap(10, 15, 32, 32)

  it('Should return a position', () => {
    expect(tiledMap.convertMapNumberToPosition(0)).toEqual({x: 0, y: 0})
    expect(tiledMap.convertMapNumberToPosition(1)).toEqual({x: 1, y: 0})
    expect(tiledMap.convertMapNumberToPosition(2)).toEqual({x: 2, y: 0})
    expect(tiledMap.convertMapNumberToPosition(10)).toEqual({x: 0, y: 1})
    expect(tiledMap.convertMapNumberToPosition(11)).toEqual({x: 1, y: 1})
    expect(tiledMap.convertMapNumberToPosition(12)).toEqual({x: 2, y: 1})
    expect(tiledMap.convertMapNumberToPosition(149)).toEqual({x: 9, y: 14})
  })
})

describe('#resize', () => {
  const tiledMap = new TiledMap(4, 5, 32, 32)
  const c1 = new MapChip([new MapChipFragment(1, 0, 0)])
  const c2 = new MapChip([new MapChipFragment(2, 0, 0)])

  beforeEach(() => {
    tiledMap.addLayer()

    // layer 0
    tiledMap.put(c1, 0, 0, 0)
    tiledMap.put(c1, 1, 0, 0)
    tiledMap.put(c1, 2, 0, 0)
    tiledMap.put(c2, 0, 2, 0)
    tiledMap.put(c2, 1, 2, 0)
    tiledMap.put(c2, 2, 2, 0)
    // layer 1
    tiledMap.put(c1, 1, 1, 1)
    tiledMap.put(c1, 2, 1, 1)
    tiledMap.put(c1, 3, 1, 1)
    tiledMap.put(c2, 1, 3, 1)
    tiledMap.put(c2, 2, 3, 1)
    tiledMap.put(c2, 3, 3, 1)
    //colider
    tiledMap.coliders.put(1, 0, 0)
    tiledMap.coliders.put(1, 1, 0)
    tiledMap.coliders.put(1, 2, 0)
    tiledMap.coliders.put(1, 0, 2)
    tiledMap.coliders.put(1, 1, 2)
    tiledMap.coliders.put(1, 2, 2)
  })

  it('Should map is expanded', () => {
    tiledMap.resize(6, 7)

    expect(tiledMap.chipCountX).toEqual(6)
    expect(tiledMap.chipCountY).toEqual(7)

    expect(tiledMap.datas[0].items).toEqual([
        c1,   c1,   c1, null, null, null,
      null, null, null, null, null, null,
        c2,   c2,   c2, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null
    ])

    expect(tiledMap.datas[1].items).toEqual([
      null, null, null, null, null, null,
      null,   c1,   c1,   c1, null, null,
      null, null, null, null, null, null,
      null,   c2,   c2,   c2, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null
    ])

    expect(tiledMap.coliders.items).toEqual([
      1, 1, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      1, 1, 1, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0
    ])
  })

  it('Should matrix is reduced', () => {
    tiledMap.resize(2, 3)

    expect(tiledMap.chipCountX).toEqual(2)
    expect(tiledMap.chipCountY).toEqual(3)

    expect(tiledMap.datas[0].items).toEqual([
        c1,   c1,
      null, null,
        c2,   c2
    ])

    expect(tiledMap.datas[1].items).toEqual([
      null, null,
      null,   c1,
      null, null
    ])

    expect(tiledMap.coliders.items).toEqual([
      1, 1,
      0, 0,
      1, 1
    ])
  })
})
