import { MapCanvasComponent } from '../src/MapCanvasComponent'
import { Projects } from '@piyoppi/pico2map-editor'
import { TiledMap } from '@piyoppi/pico2map-tiled'

customElements.define('map-canvas-component', MapCanvasComponent)

async function setComponent(attributes: string): Promise<MapCanvasComponent> {
  document.body.innerHTML = `
    <map-canvas-component ${attributes}></map-canvas-component>
  `

  const component = document.getElementsByTagName('map-canvas-component')[0] as MapCanvasComponent
  await component.updateComplete

  return component
}

test('Create layer canvases', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  tiledMap.addLayer()
  tiledMap.addLayer()
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)
  // 3 layers + 1 sub-cnavas = 4 canvases
  expect(component.shadowRoot?.innerHTML.match(/<canvas/g)?.length).toEqual(4)  

  tiledMap.addLayer()
  await component.updateComplete
  // 4 layers + 1 sub-cnavas = 5 canvases
  expect(component.shadowRoot?.innerHTML.match(/<canvas/g)?.length).toEqual(5)

  const tiledMap2 = new TiledMap(10, 15, 32, 32)
  const project2 = Projects.add(tiledMap2)
  component.setAttribute('projectId', project2.projectId.toString())
  await component.updateComplete
  // 1 layer + 1 sub-cnavas = 2 canvases
  expect(component.shadowRoot?.innerHTML.match(/<canvas/g)?.length).toEqual(2)

  const tiledMap3 = new TiledMap(15, 20, 32, 32)
  tiledMap3.addLayer()
  tiledMap3.addLayer()
  tiledMap3.addLayer()
  tiledMap3.addLayer()
  const project3 = Projects.add(tiledMap3)
  component.setAttribute('projectId', project3.projectId.toString())
  await component.updateComplete
  // 5 layer + 1 sub-cnavas = 6 canvases
  expect(component.shadowRoot?.innerHTML.match(/<canvas/g)?.length).toEqual(6)
})

test('The component should set Project to MapCanvas', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent('')

  jest.spyOn(component.mapCanvas, 'setProject')
  component.setAttribute('projectId', project.projectId.toString())

  await component.updateComplete

  expect(component.mapCanvas.setProject).toBeCalledTimes(1)
  expect(component.mapCanvas.setProject).toBeCalledWith(project)
})

test('Should set Project to MapCanvas when the project is registered after ProjectId', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const component = await setComponent('')
  const projectId = 12345

  jest.spyOn(component.mapCanvas, 'setProject')
  component.setAttribute('projectId', projectId.toString())
  await component.updateComplete

  expect(component.mapCanvas.setProject).not.toBeCalled()

  const project = Projects.add(tiledMap, projectId)
  await component.updateComplete

  expect(component.mapCanvas.setProject).toBeCalledTimes(1)
  expect(component.mapCanvas.setProject).toBeCalledWith(project)
})

test('The component should set brush name to MapCanvas', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  component.mapCanvas.setBrushFromName = jest.fn()
  component.setAttribute('brush', 'TestBrush')

  await component.updateComplete

  expect(component.mapCanvas.setBrushFromName).toBeCalledWith('TestBrush')
})

test('The component should set arrangement name to MapCanvas', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  component.mapCanvas.setArrangementFromName = jest.fn()
  component.setAttribute('arrangement', 'TestArrangement')

  await component.updateComplete

  expect(component.mapCanvas.setArrangementFromName).toBeCalledWith('TestArrangement')
})
