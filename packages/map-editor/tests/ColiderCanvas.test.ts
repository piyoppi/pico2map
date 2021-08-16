import { Projects } from './../src/Projects'
import { ColiderCanvas } from './../src/ColiderCanvas'
import { TiledMap } from '@piyoppi/pico2map-tiled'
import { ColiderRenderer } from './../src/ColiderRenderer'
import { mocked } from 'ts-jest/utils'
import { createMockedCanvas } from './TestHelpers/MockedCanvas'
import { EmptyBrush } from './TestHelpers/EmptyBrush'
import { ColiderTypes } from '@piyoppi/pico2map-tiled-colision-detector'
import { ColiderArrangement } from './../src/Brushes/Arrangements/ColiderArrangement'

jest.mock('./../src/ColiderRenderer')

beforeEach(() => {
  mocked(ColiderRenderer).mockClear()
})

const tiledMap = new TiledMap(30, 30, 32, 32)

describe('rendererable', () => {
  it('Should return true when projectId and canvas is given', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)

    expect(coliderCanvas.renderable).toEqual(true)
  })

  it('Should return false when projectId is not given', () => {
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)

    expect(coliderCanvas.renderable).toEqual(false)
  })

  it('Should return false when canvas is not given', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setProject(project)

    expect(coliderCanvas.renderable).toEqual(false)
  })
})

describe('#setProject', () => {
  it('Should call renderAll function', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)

    const mockedRendererInstance = mocked(ColiderRenderer).mock.instances[0]
    expect(mockedRendererInstance.renderAll).toBeCalledTimes(1)
  })

  it('Should not call renderAll function when the canvas is not given.', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setProject(project)

    const mockedRendererInstance = mocked(ColiderRenderer).mock.instances[0]
    expect(mockedRendererInstance.renderAll).not.toBeCalled()
  })
})

describe('setCanvas', () => {
  it('Should call renderAll function when projectId is already set.', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setProject(project)
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)

    const mockedRendererInstance = mocked(ColiderRenderer).mock.instances[0]
    expect(mockedRendererInstance.renderAll).toBeCalledTimes(1)
  })
})

describe('#mouseDown', () => {
  function coliderCanvasFactory() {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)

    const brush = new EmptyBrush()
    const arrangement = new ColiderArrangement()
    arrangement.setColiderTypes = jest.fn()
    brush.mouseDown = jest.fn()
    brush.mouseMove = jest.fn().mockReturnValue([])
    coliderCanvas.setBrush(brush)
    coliderCanvas.setArrangement(arrangement)

    return { brush, coliderCanvas, arrangement }
  }

  it('Should painted', () => {
    const { brush, coliderCanvas, arrangement } = coliderCanvasFactory()
    coliderCanvas.setColiderType(1)
    coliderCanvas.setSubColiderType(0)

    coliderCanvas.mouseDown(40, 70)

    expect(coliderCanvas.isMouseDown).toEqual(true)
    expect(brush.mouseDown).toBeCalledWith(1, 2)
    expect(brush.mouseMove).toBeCalledWith(1, 2)
    expect(arrangement.setColiderTypes).toHaveBeenCalledWith(1)
  })

  it('Should set subColiderType when subButton is true', () => {
    const { coliderCanvas, arrangement } = coliderCanvasFactory()

    coliderCanvas.setColiderType(1)
    coliderCanvas.setSubColiderType(0)
    coliderCanvas.mouseDown(40, 70, true)

    expect(arrangement.setColiderTypes).toHaveBeenCalledWith(0)
  })
})

describe('#subscribeProjectEvent', () => {
  it('Should subscribes to project-event', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)
    coliderCanvas.subscribeProjectEvent()

    expect(coliderCanvas.isSubscribedProjectEvent).toEqual(true)

    coliderCanvas.coliderRenderer.renderAll = jest.fn()
    project.requestRenderAll()
    expect(coliderCanvas.coliderRenderer.renderAll).toBeCalledTimes(1)
  })

  it('Should throw an error when coliderCanvas do not have a project', () => {
    const coliderCanvas = new ColiderCanvas()

    expect(() => coliderCanvas.subscribeProjectEvent()).toThrow('Project is not set')
  })

  it('Should throw an error when coliderCanvas is already subscribed to project-event', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setProject(project)
    coliderCanvas.subscribeProjectEvent()

    expect(() => coliderCanvas.subscribeProjectEvent()).toThrow('Project Event is already subscribed')
  })
})

describe('#unsubscribeProjectEvent', () => {
  it('Should unsubscribes from project-event', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)
    coliderCanvas.subscribeProjectEvent()

    expect(coliderCanvas.isSubscribedProjectEvent).toEqual(true)

    coliderCanvas.unsubscribeProjectEvent()

    expect(coliderCanvas.isSubscribedProjectEvent).toEqual(false)

    coliderCanvas.coliderRenderer.renderAll = jest.fn()
    project.requestRenderAll()
    expect(coliderCanvas.coliderRenderer.renderAll).not.toBeCalled()
  })
})
