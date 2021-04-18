import { Projects } from './../src/Projects'
import { MapCanvas } from './../src/MapCanvas'
import { TiledMap } from '@piyoppi/pico2map-tiled'
import { Brush } from './../src/Brushes/Brush'
import { Arrangement } from '../src/Brushes/Arrangements/Arrangement'

class EmptyBrush<T> implements Brush<T> {
  setArrangement(_: Arrangement<T>) {}
  mouseDown(_: number, __: number) {}
  mouseMove(_: number, __: number) {return []}
  mouseUp(_: number, __: number) {return []}
  cleanUp() {}
}

describe('#setActiveLayer', () => {
  it('Should set an active layer', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.setProject(project)
    
    tiledMap.addLayer()

    mapCanvas.setActiveLayer(1)
    expect(mapCanvas.activeLayer).toEqual(1)

    // Layer 2 is out of range.
    expect(() => mapCanvas.setActiveLayer(2)).toThrow()
  })
})

describe('#setProject', () => {
  it('Should set a project and create MapRenderer', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()

    mapCanvas.setProject(project)

    expect(mapCanvas.project).toEqual(project)
    expect(mapCanvas.renderer).not.toBeNull()
  })

  it('Should re-create MapRenderer when project was set again', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()

    mapCanvas.setProject(project)
    const previousRenderer = mapCanvas.renderer
    expect(mapCanvas.renderer).toBe(previousRenderer)

    mapCanvas.setProject(project)
    expect(mapCanvas.renderer).not.toBe(previousRenderer)
  })
})

describe('#putChip', () => {
  let mockedCanvas = {}
  let mockedCanvasLayer1 = {}
  let mockedSecondaryCanvas = {}

  beforeEach(() => {
    mockedCanvas = {
      getContext: jest.fn().mockReturnValueOnce('dummy-context-layer0')
    }
    mockedCanvasLayer1 = {
      getContext: jest.fn().mockReturnValueOnce('dummy-context-layer1')
    }
    mockedSecondaryCanvas = {
      getContext: jest.fn().mockReturnValue('dummy-sub-context')
    }
  })

  it('Should put a mapChip', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.setProject(project)

    mapCanvas.setCanvases([mockedCanvas] as any, mockedSecondaryCanvas as any)

    tiledMap.put = jest.fn()
    mapCanvas.renderer.putOrClearChipToCanvas = jest.fn()
    
    mapCanvas.putChip(null, 1, 2)
    expect(tiledMap.put).toBeCalledWith(null, 1, 2, 0)
    expect(mapCanvas.renderer.putOrClearChipToCanvas).toBeCalledWith('dummy-context-layer0', null, 1, 2)
  })

  it('Should put a mapChip into an active layer', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    tiledMap.addLayer()
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.setProject(project)

    mapCanvas.setCanvases([mockedCanvas, mockedCanvasLayer1] as any, mockedSecondaryCanvas as any)
    mapCanvas.setActiveLayer(1)

    tiledMap.put = jest.fn()
    mapCanvas.renderer.putOrClearChipToCanvas = jest.fn()
    
    mapCanvas.putChip(null, 1, 2)
    expect(tiledMap.put).toBeCalledWith(null, 1, 2, 1)
    expect(mapCanvas.renderer.putOrClearChipToCanvas).toBeCalledWith('dummy-context-layer1', null, 1, 2)
  })
})

describe('#mouseDown', () => {
  it('Should painted', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.setProject(project)

    const brush = new EmptyBrush()
    brush.mouseDown = jest.fn()
    brush.mouseMove = jest.fn().mockReturnValue([])
    mapCanvas.setBrush(brush)

    mapCanvas.mouseDown(40, 70)

    expect(brush.mouseDown).toBeCalledWith(1, 2)
    expect(brush.mouseMove).toBeCalledWith(1, 2)
  })
})
