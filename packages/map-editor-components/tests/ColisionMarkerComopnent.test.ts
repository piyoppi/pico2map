import { ColiderMarkerComponent } from '../src/ColisionMarkerComponent'
import { Projects } from '@piyoppi/pico2map-editor'
import { TiledMap } from '@piyoppi/pico2map-tiled'

customElements.define('colider-marker-component', ColiderMarkerComponent)

async function setComponent(attributes: string): Promise<ColiderMarkerComponent> {
  document.body.innerHTML = `
    <div id="container">
      <colider-marker-component ${attributes}></colider-marker-component>
    </div>
    <div id="secondary-container">
    </div>
  `

  const component = document.getElementsByTagName('colider-marker-component')[0] as ColiderMarkerComponent
  await component.updateComplete

  return component
}

test('Unsubscribe project event when the component is removed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  expect(component.coliderCanvas.isSubscribedProjectEvent).toEqual(true)

  component.coliderCanvas.unsubscribeProjectEvent = jest.fn()

  document.body.innerHTML = ''

  expect(component.coliderCanvas.unsubscribeProjectEvent).toBeCalled()
})

test('Unsubscribe / subscribe project event when the component is moved', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  jest.spyOn(component.coliderCanvas, 'subscribeProjectEvent')
  jest.spyOn(component.coliderCanvas, 'unsubscribeProjectEvent')

  const container = document.getElementById('secondary-container') as HTMLDivElement
  container.appendChild(component)

  expect(component.coliderCanvas.unsubscribeProjectEvent).toBeCalled()
  expect(component.coliderCanvas.subscribeProjectEvent).toBeCalled()
})

test('Reset subscription of project event when projectId is changed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  jest.spyOn(component.coliderCanvas, 'subscribeProjectEvent')
  jest.spyOn(component.coliderCanvas, 'unsubscribeProjectEvent')

  const tiledMap2 = new TiledMap(10, 10, 32, 32)
  const project2 = Projects.add(tiledMap2)
  component.setAttribute('projectId', project2.projectId.toString())

  expect(component.coliderCanvas.unsubscribeProjectEvent).toBeCalledTimes(1)
  expect(component.coliderCanvas.subscribeProjectEvent).toBeCalledTimes(1)
})

test('Canvas size is set', async () => {
  const tiledMap = new TiledMap(10, 2, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)
  const canavs = component.shadowRoot?.getElementById('colider-canvas') as HTMLCanvasElement
  const secondaryCanavs = component.shadowRoot?.getElementById('secondary-canvas') as HTMLCanvasElement

  expect(canavs.width).toEqual(320)
  expect(canavs.height).toEqual(64)

  tiledMap.resize(3, 4)
  component.requestUpdate()
  await component.updateComplete

  expect(canavs.width).toEqual(96)
  expect(canavs.height).toEqual(128)
})

test('Should set brush name to ColiderCanvas', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  component.coliderCanvas.setBrushFromName = jest.fn()
  component.setAttribute('brush', 'TestBrush')

  await component.updateComplete

  expect(component.coliderCanvas.setBrushFromName).toBeCalledWith('TestBrush')
})

test('Should change projects when projectId attribute is changed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const tiledMap2 = new TiledMap(10, 10, 32, 32)
  const project2 = Projects.add(tiledMap2)
  const component = await setComponent(`projectId=${project.projectId}`)

  expect(component.coliderCanvas.project).toEqual(project)

  component.setAttribute('projectId', project2.projectId.toString())
  await component.updateComplete

  expect(component.coliderCanvas.project).toEqual(project2)
})

test('Should set canvases to ColiderCanvas', async () => {
  const component = await setComponent('')

  expect(component.coliderCanvas.coliderCtx).not.toBeNull()
  expect(component.coliderCanvas.secondaryCanvasCtx).not.toBeNull()
})
