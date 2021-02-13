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

    tiledMap.put(mapChip, 3, 2)
    expect(tiledMap.data.getFromChipPosition(3, 2)).toEqual(mapChip)
  })
})

describe('data', () => {
  it('Should return map data', () => {
    const actualMapData = tiledMap.data
    expect(actualMapData.width).toEqual(mapSize.width)
    expect(actualMapData.height).toEqual(mapSize.height)
  })
})
