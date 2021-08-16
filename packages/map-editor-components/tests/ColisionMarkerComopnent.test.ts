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
