import { DefaultAutoTileImportStrategy } from '../../src/AutoTile/DefaultAutoTileImportStrategy'
import { MapChipImage } from '../../src/MapChipImage'
import { DummyImage } from '../Helpers/DummyImage'
import { MapChipFragment } from './../../src/MapChip'

Object.defineProperty(window, 'Image', {
  value: class extends DummyImage {
    get width() { return 70 }
    get height() { return 360 }
  }
})

describe('getMapChipFragments', () => {
  it('Should return MapChipFragments', () => {
    const image = new MapChipImage('dummy.png', 1)
    image.loadImage()

    const strategy = new DefaultAutoTileImportStrategy(image, 32, 32)

    expect(strategy.getMapChipFragments()).toEqual([
      [
        new MapChipFragment(0, 0, 1),
        new MapChipFragment(0, 1, 1),
        new MapChipFragment(0, 2, 1),
        new MapChipFragment(0, 3, 1),
        new MapChipFragment(0, 4, 1)
      ],
      [
        new MapChipFragment(1, 0, 1),
        new MapChipFragment(1, 1, 1),
        new MapChipFragment(1, 2, 1),
        new MapChipFragment(1, 3, 1),
        new MapChipFragment(1, 4, 1)
      ],
      [
        new MapChipFragment(0, 5, 1),
        new MapChipFragment(0, 6, 1),
        new MapChipFragment(0, 7, 1),
        new MapChipFragment(0, 8, 1),
        new MapChipFragment(0, 9, 1)
      ],
      [
        new MapChipFragment(1, 5, 1),
        new MapChipFragment(1, 6, 1),
        new MapChipFragment(1, 7, 1),
        new MapChipFragment(1, 8, 1),
        new MapChipFragment(1, 9, 1)
      ],
    ])
  })
})
