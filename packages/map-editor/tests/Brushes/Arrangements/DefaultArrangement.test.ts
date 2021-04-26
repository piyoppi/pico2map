import { DefaultArrangement } from './../../../src/Brushes/Arrangements/DefaultArrangement'
import { MapChip, MapChipFragment } from '@piyoppi/pico2map-tiled'

const chipId = 2

describe('#setMapChip', () => {
  it('Should raise error when a empty array is given', () => {
    const arrangement = new DefaultArrangement()
    expect(() => arrangement.setMapChips([])).toThrow()
  })
})

describe('#apply', () => {
  it('Should return paints', () => {
    const arrangement = new DefaultArrangement()
    const mapChipFragments = [
      new MapChipFragment(2, 1, chipId),
      new MapChipFragment(2, 2, chipId),
      new MapChipFragment(3, 1, chipId),
      new MapChipFragment(3, 2, chipId)
    ]

    arrangement.setMapChips(mapChipFragments)

    expect(arrangement.apply([{x: 4, y: 3}])).toEqual([
      {x: 4, y: 3, item: new MapChip([mapChipFragments[0]])},
      {x: 4, y: 4, item: new MapChip([mapChipFragments[1]])},
      {x: 5, y: 3, item: new MapChip([mapChipFragments[2]])},
      {x: 5, y: 4, item: new MapChip([mapChipFragments[3]])}
    ])
  })
})
