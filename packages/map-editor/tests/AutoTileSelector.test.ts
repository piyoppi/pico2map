import { AutoTileSelector } from '../src/AutoTileSelector'
import { AutoTile, AutoTiles, MapChipFragment, MapChipsCollection } from '@piyoppi/pico2map-tiled'

const autoTiles = new AutoTiles()
autoTiles.push(new AutoTile([new MapChipFragment(0, 0, 1)], 1))
autoTiles.push(new AutoTile([new MapChipFragment(1, 0, 1)], 2))
autoTiles.push(new AutoTile([new MapChipFragment(2, 0, 1)], 3))
autoTiles.push(new AutoTile([new MapChipFragment(3, 0, 1)], 4))
autoTiles.push(new AutoTile([new MapChipFragment(4, 0, 1)], 5))
autoTiles.push(new AutoTile([new MapChipFragment(5, 0, 1)], 6))
autoTiles.push(new AutoTile([new MapChipFragment(6, 0, 1)], 7))
autoTiles.push(new AutoTile([new MapChipFragment(7, 0, 1)], 8))
autoTiles.push(new AutoTile([new MapChipFragment(8, 0, 1)], 9))
autoTiles.push(new AutoTile([new MapChipFragment(9, 0, 1)], 10))
const mapChips = new MapChipsCollection()

describe('getSizeOfIndexImage', () => {
  it('Should return the size', () => {
    const selector = new AutoTileSelector(128, 32, 32, autoTiles, mapChips)

    expect(selector.getSizeOfIndexImage()).toEqual({width: 128, height: 96})
  })
})
