import { Projects } from './../src/Projects'
import { ColiderCanvas } from './../src/ColiderCanvas'
import { TiledMap } from '@piyoppi/pico2map-tiled'
import { ColiderRenderer } from './../src/ColiderRenderer'
import { mocked } from 'ts-jest/utils'
import { createMockedCanvas } from './TestHelpers/MockedCanvas'
import { EmptyBrush } from './TestHelpers/EmptyBrush'

jest.mock('./../src/ColiderRenderer')

beforeEach(() => {
  mocked(ColiderRenderer).mockClear()
})

const tiledMap = new TiledMap(30, 30, 32, 32)

describe('#setProject', () => {
  it('Should call renderAll function', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)

    coliderCanvas.setProject(project)

    const mockedRendererInstance = mocked(ColiderRenderer).mock.instances[0]
    expect(mockedRendererInstance.renderAll).toBeCalled()
  })
})

describe('#mouseDown', () => {
  it('Should painted', () => {
    const project = Projects.add(tiledMap)
    const coliderCanvas = new ColiderCanvas()
    coliderCanvas.setCanvas(createMockedCanvas() as any, createMockedCanvas() as any)
    coliderCanvas.setProject(project)

    const brush = new EmptyBrush()
    brush.mouseDown = jest.fn()
    brush.mouseMove = jest.fn().mockReturnValue([])
    coliderCanvas.setBrush(brush)

    coliderCanvas.mouseDown(40, 70)

    expect(coliderCanvas.isMouseDown).toEqual(true)
    expect(brush.mouseDown).toBeCalledWith(1, 2)
    expect(brush.mouseMove).toBeCalledWith(1, 2)
  })
})
