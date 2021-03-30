import { Projects } from './../src/Projects'
import { TiledMap } from '@piyoppi/pico2map-tiled'

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
