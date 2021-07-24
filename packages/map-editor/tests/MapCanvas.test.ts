import { Projects } from './../src/Projects'
import { MapCanvas } from './../src/MapCanvas'
import { TiledMap } from '@piyoppi/pico2map-tiled'
import { EmptyBrush } from './TestHelpers/EmptyBrush'
import { EmptyArrangement } from './TestHelpers/EmptyArrangement'
import { DummyAutoTileArrangement } from './TestHelpers/DummyAutoTileArrangement'
import { MapChipFragment, MapChip, AutoTile, AutoTileMapChip } from '@piyoppi/pico2map-tiled'

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


describe('#setActiveLayer', () => {
  it('Should set an active layer', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()

    const brush = new EmptyBrush()
    const arrangement = new DummyAutoTileArrangement()
    brush.setArrangement = jest.fn()
    arrangement.setTiledMapData = jest.fn()
    mapCanvas.setBrush(brush)
    mapCanvas.setArrangement(arrangement)

    mapCanvas.setProject(project)
    
    tiledMap.addLayer()

    mapCanvas.setActiveLayer(1)

    expect(mapCanvas.activeLayer).toEqual(1)

    // Layer 2 is out of range.
    expect(() => mapCanvas.setActiveLayer(2)).toThrow()

    expect(brush.setArrangement).toBeCalled()
    expect(arrangement.setTiledMapData).toBeCalled()
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

  it('Should call renderAll function', async () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.renderAll = jest.fn()

    mapCanvas.setCanvases([mockedCanvas, mockedCanvasLayer1] as any, mockedSecondaryCanvas as any)
    await mapCanvas.setProject(project)

    expect(mapCanvas.renderAll).toBeCalledTimes(1)
  })

  it('Should not call renderAll function when canvases are not set', async () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.renderAll = jest.fn()

    await mapCanvas.setProject(project)

    expect(mapCanvas.renderAll).not.toBeCalledTimes(1)
  })
})

describe('#setCanvases', () => {
  it('Should call rendering function when projectId is already set.', async () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.renderAll = jest.fn()

    await mapCanvas.setProject(project)
    mapCanvas.setCanvases([mockedCanvas, mockedCanvasLayer1] as any, mockedSecondaryCanvas as any)

    expect(mapCanvas.renderAll).toBeCalledTimes(1)
  })

  it('Should not call rendering function when projectId is not given.', async () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const mapCanvas = new MapCanvas()
    mapCanvas.renderAll = jest.fn()

    mapCanvas.setCanvases([mockedCanvas, mockedCanvasLayer1] as any, mockedSecondaryCanvas as any)

    expect(mapCanvas.renderAll).not.toBeCalled()
  })
})

describe('#renderAll', () => {
  it('Should call rendering function each layers', async () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    await mapCanvas.setProject(project)

    mapCanvas.renderer.renderLayer = jest.fn()
    mapCanvas.setCanvases([mockedCanvas, mockedCanvasLayer1] as any, mockedSecondaryCanvas as any)

    // Reset renderLayer mock because renderAll is invoked by `mapCanvas.setCanvases`
    mapCanvas.renderer.renderLayer = jest.fn()
    mapCanvas.renderAll()

    expect(mapCanvas.renderer.renderLayer).toBeCalledTimes(2)
  })
})

describe('#putChip', () => {
  it('Should put a mapChip', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.renderAll = jest.fn()
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
    mapCanvas.renderAll = jest.fn()
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
  const c1Fragments = [new MapChipFragment(1, 0, 0)]
  const c2Fragments = [new MapChipFragment(2, 0, 0)]
  const c1 = new MapChip(c1Fragments)
  const c2 = new MapChip(c2Fragments)
  const autoTileFragments = [new MapChipFragment(2, 0, 0)]
  const autoTileMapChip = new AutoTileMapChip(1, autoTileFragments, '')
  const autoTile = new AutoTile(autoTileFragments, 1)
  const pickedEventHandler = jest.fn()

  beforeEach(() => {
    pickedEventHandler.mockClear()
  })

  function mapCanvasFactory() {
    const tiledMap = new TiledMap(3, 3, 32, 32)
    tiledMap.addLayer()
    tiledMap.autoTiles.push(autoTile)
    tiledMap.put(c1, 0, 0, 0)
    tiledMap.put(c2, 0, 0, 1)
    tiledMap.put(autoTileMapChip, 2, 0, 0)

    const project = Projects.add(tiledMap)
    const mapCanvas = new MapCanvas()
    mapCanvas.setPickedCallback(pickedEventHandler)
    mapCanvas.renderAll = jest.fn()
    mapCanvas.setProject(project)
    mapCanvas.setArrangement(new EmptyArrangement())

    const brush = new EmptyBrush()
    brush.mouseDown = jest.fn()
    brush.mouseMove = jest.fn().mockReturnValue([])
    mapCanvas.setBrush(brush)

    return {mapCanvas, brush}
  }

  it('Should painted', () => {
    const {mapCanvas, brush} = mapCanvasFactory()
    mapCanvas.setMapChipFragments(c1Fragments)

    mapCanvas.mouseDown(40, 70)

    expect(mapCanvas.isMouseDown).toEqual(true)
    expect(brush.mouseDown).toBeCalledWith(1, 2)
    expect(brush.mouseMove).toBeCalledWith(1, 2)
  })

  it('Should painted AutoTile', () => {
    const {mapCanvas, brush} = mapCanvasFactory()
    mapCanvas.setArrangement(new DummyAutoTileArrangement())
    mapCanvas.setAutoTile(autoTile)

    mapCanvas.mouseDown(40, 70)

    expect(mapCanvas.isMouseDown).toEqual(true)
    expect(brush.mouseDown).toBeCalledWith(1, 2)
    expect(brush.mouseMove).toBeCalledWith(1, 2)
  })

  it('Should not painted when the arrangement requires mapChipFragments and the mapCanavs has no mapChipFragments', () => {
    const {mapCanvas, brush} = mapCanvasFactory()

    mapCanvas.mouseDown(40, 70)
    expect(mapCanvas.isMouseDown).toEqual(false)
    expect(brush.mouseDown).not.toBeCalled()
    expect(brush.mouseMove).not.toBeCalled()
  })

  it('Should picked a mapchip when the cursor is over the mapchip', () => {
    const {mapCanvas, brush} = mapCanvasFactory()

    mapCanvas.mouseDown(0, 0, true)
    expect(mapCanvas.isMouseDown).toEqual(false)
    expect(brush.mouseDown).not.toBeCalled()
    expect(brush.mouseMove).not.toBeCalled()
    expect(mapCanvas.selectedMapChipFragments).toEqual(c2Fragments)
    expect(pickedEventHandler).toBeCalledWith(c2)
  })

  it('Should picked a mapchip from an active layer when isPickFromActiveLayer is true', () => {
    const {mapCanvas, brush} = mapCanvasFactory()

    mapCanvas.isPickFromActiveLayer = true
    mapCanvas.setActiveLayer(0)
    mapCanvas.mouseDown(0, 0, true)
    expect(mapCanvas.isMouseDown).toEqual(false)
    expect(brush.mouseDown).not.toBeCalled()
    expect(brush.mouseMove).not.toBeCalled()
    expect(mapCanvas.selectedMapChipFragments).toEqual(c1Fragments)
    expect(pickedEventHandler).toBeCalledWith(c1)
  })

  it('Should picked a AutoTile when the cursor is over the AutoTile', () => {
    const {mapCanvas, brush} = mapCanvasFactory()

    mapCanvas.mouseDown(66, 0, true)
    expect(mapCanvas.isMouseDown).toEqual(false)
    expect(brush.mouseDown).not.toBeCalled()
    expect(brush.mouseMove).not.toBeCalled()
    expect(mapCanvas.selectedAutoTile).toEqual(autoTile)
    expect(pickedEventHandler).toBeCalledWith(autoTileMapChip)
  })

  it('Should not picked when the cursor is over the empty space', () => {
    const {mapCanvas, brush} = mapCanvasFactory()

    mapCanvas.mouseDown(32, 32, true)
    expect(mapCanvas.isMouseDown).toEqual(false)
    expect(brush.mouseDown).not.toBeCalled()
    expect(brush.mouseMove).not.toBeCalled()
    expect(mapCanvas.selectedMapChipFragments).toEqual([])
    expect(mapCanvas.selectedAutoTile).toEqual(null)
    expect(pickedEventHandler).toBeCalledWith(null)
  })
})
