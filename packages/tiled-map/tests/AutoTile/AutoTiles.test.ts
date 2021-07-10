import { AutoTiles } from './../../src/AutoTile/AutoTiles'
import { AutoTile } from './../../src/AutoTile/AutoTile'
import { MapChipFragment } from './../../src/MapChip'
import { MapChipImage } from '../../src/MapChipImage'
import { AutoTileImportStrategy, MapChipFragmentGroups } from '../../src/AutoTile/ImportStrategy'

const mapChipImage1 = new MapChipImage('dummy1.png', 1)
const mapChipImage2 = new MapChipImage('dummy2.png', 2)
const c1 = new MapChipFragment(0, 0, mapChipImage1.id)
const c2 = new MapChipFragment(0, 0, mapChipImage2.id)
const autoTile1 = new AutoTile([c1], 1)
const autoTile2 = new AutoTile([c1, c2], 2)
const autoTile3 = new AutoTile([c2], 3)

class DummyAutoTileImportStrategy implements AutoTileImportStrategy {
  constructor(
    private _mapChipImage: MapChipImage,
  ) {}

  getMapChipFragments() {
    return [[new MapChipFragment(0, 0, this._mapChipImage.id)]]
  }
}

describe('findByImage', () => {
  it('Should return AutoTiles with the given MapChipImages', () => {
    const autoTiles = new AutoTiles()

    autoTiles.push(autoTile1)
    autoTiles.push(autoTile2)
    autoTiles.push(autoTile3)

    expect(autoTiles.findByImage(mapChipImage1)).toEqual([autoTile1, autoTile2])
  })
})

describe('push', () => {
  it('Should add the given AutoTile', () => {
    const autoTiles = new AutoTiles()

    autoTiles.push(autoTile1)
    expect(Array.from(autoTiles.values())).toEqual([autoTile1])
    
    autoTiles.push(autoTile2)
    expect(Array.from(autoTiles.values())).toEqual([autoTile1, autoTile2])
  })
})

describe('remove', () => {
  it('Should remove the given AutoTile', () => {
    const autoTiles = new AutoTiles()

    autoTiles.push(autoTile1)
    autoTiles.push(autoTile2)

    autoTiles.remove(autoTile1)

    expect(Array.from(autoTiles.values())).toEqual([autoTile2])
  })
})

describe('length', () => {
  it('Should return a length', () => {
    const autoTiles = new AutoTiles()

    autoTiles.push(autoTile1)
    expect(autoTiles.length).toEqual(1)

    autoTiles.push(autoTile2)
    expect(autoTiles.length).toEqual(2)
  })
})

describe('import', () => {
  it('Should add the AutoTile', () => {
    const strategy = new DummyAutoTileImportStrategy(mapChipImage1)
    const autoTiles = new AutoTiles()

    const imported1 = autoTiles.import(strategy)
    const expectedFragments = strategy.getMapChipFragments()[0]
    expect(imported1[0].id).toEqual(1)
    expect(imported1[0].mapChipFragments).toEqual(expectedFragments)

    const imported2 = autoTiles.import(strategy)
    expect(imported2[0].id).toEqual(2)
  })
})
