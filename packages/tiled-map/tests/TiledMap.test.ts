import { TiledMap } from './../src/TiledMap'
import { MapChip, MapChipFragment } from './../src/MapChip'

const mapSize = {
  width: 10,
  height: 15
}
const tiledMap = new TiledMap(mapSize.width, mapSize.height, 32, 32)

describe('#convertChipPositionToPixel', () => {
  it('Should return converted position', () => {
    expect(tiledMap.convertChipPositionToPixel(0, 0)).toEqual({x: 0, y: 0})
    expect(tiledMap.convertChipPositionToPixel(2, 0)).toEqual({x: 64, y: 0})
    expect(tiledMap.convertChipPositionToPixel(0, 2)).toEqual({x: 0, y: 64})
    expect(tiledMap.convertChipPositionToPixel(3, 4)).toEqual({x: 96, y: 128})
  })
})

describe('#put', () => {
  it('Should put a map chip', () => {
    const mapChip = new MapChip([new MapChipFragment(1, 1, 1)])

    tiledMap.put(mapChip, 3, 2, 0)
    expect(tiledMap.datas[0].getFromChipPosition(3, 2)).toEqual(mapChip)
  })
})

describe('data', () => {
  it('Should return map data', () => {
    const actualMapData = tiledMap.datas[0]
    expect(actualMapData.width).toEqual(mapSize.width)
    expect(actualMapData.height).toEqual(mapSize.height)
  })
})

describe('#addLayer', () => {
  it('Should add a layer', () => {
    tiledMap.addLayer()
    expect(tiledMap.datas.length).toEqual(2)
    tiledMap.addLayer()
    expect(tiledMap.datas.length).toEqual(3)
  })
})

describe('#convertMapNumberToPosition', () => {
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
