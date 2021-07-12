import { Projects } from './../src/Projects'
import { TiledMap, AutoTile, MapChipImage } from '@piyoppi/pico2map-tiled'

describe('When add a layer', () => {
  it('Should call registered callback', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap, 1)
    const mockFn = jest.fn()
    project.addBeforeAddLayerCallback(mockFn)

    tiledMap.addLayer()
    expect(mockFn).toBeCalled()
  })
})

describe('When add an autoTile', () => {
  it('Should call registered callback', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap, 1)
    const autoTile = new AutoTile([], 1)

    const mockFn = jest.fn()
    project.addAfterAddAutoTileCallback(mockFn)

    tiledMap.autoTiles.push(autoTile)
    expect(mockFn).toBeCalled()
  })
})

describe('When remove an autoTile', () => {
  it('Should call registered callback', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap, 1)
    const autoTile = new AutoTile([], 1)
    tiledMap.autoTiles.push(autoTile)

    const mockFn = jest.fn()
    project.addAfterRemoveAutoTileCallback(mockFn)

    tiledMap.autoTiles.remove(autoTile)
    expect(mockFn).toBeCalled()
  })
})

describe('When replace a MapChipImage', () => {
  it('Should call registered callback', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap, 1)
    const mapChipImage1 = new MapChipImage('dummy1.png', 1)
    const mapChipImageReplaced = new MapChipImage('dummy1-new.png', 1)
    tiledMap.mapChipsCollection.push(mapChipImage1)

    const mockFn = jest.fn()
    project.addAfterReplacedMapChipImageCallback(mockFn)

    tiledMap.mapChipsCollection.replace(mapChipImageReplaced)

    expect(mockFn).toBeCalled()
  })
})
