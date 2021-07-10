import { AutoTile } from '../../src/AutoTile/AutoTile'
import { MapChipFragment } from './../../src/MapChip'
import { MapChipImage } from '../../src/MapChipImage'

const mapChipImage1 = new MapChipImage('dummy1.png', 1)
const mapChipImage2 = new MapChipImage('dummy2.png', 2)
const c1 = new MapChipFragment(0, 0, mapChipImage1.id)
const c2 = new MapChipFragment(0, 0, mapChipImage2.id)

describe('getMapChipImageIds', () => {
  it('Should return mapChipImageIds', () => {
    const autoTile = new AutoTile([c1, c2], 1)

    expect(autoTile.getMapChipImageIds()).toEqual([1, 2])
  })
})
