import { MapChipSelectorComponent } from '../src/MapChipSelectorComponent'
import { Projects } from '@piyoppi/pico2map-editor'
import { TiledMap, MapChipImage } from '@piyoppi/pico2map-tiled'

customElements.define('mapchip-selector-component', MapChipSelectorComponent)

async function setComponent(attributes: string): Promise<MapChipSelectorComponent> {
  document.body.innerHTML = `
    <div id="container">
      <mapchip-selector-component ${attributes}></mapchip-selector-component>
    </div>
    <div id="secondary-container">
    </div>
  `

  const component = document.getElementsByTagName('mapchip-selector-component')[0] as MapChipSelectorComponent
  await component.updateComplete

  return component
}

test('The component should be set up', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const chipImage = new MapChipImage('dummy.png', 1)
  tiledMap.mapChipsCollection.push(chipImage)

  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId} chipId=${chipImage.id}`)

  expect(component.shadowRoot?.innerHTML).toContain('src="dummy.png"')
  expect(component.shadowRoot?.innerHTML).toContain('class="cursor"')
  expect(component.shadowRoot?.innerHTML).not.toContain('class="selected"')
})

test('Unsubscribe project event when the component is removed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  expect(component.subscribedProjectEvent).toEqual(true)

  document.body.innerHTML = ''
  await component.updateComplete

  expect(component.subscribedProjectEvent).toEqual(false)
})

test('Subscribe project event when the component is moved', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  const container = document.getElementById('secondary-container') as HTMLDivElement
  container.appendChild(component)

  expect(component.subscribedProjectEvent).toEqual(true)
})

test('Reset subscription of project event when projectId is changed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  expect(project.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(1)

  const tiledMap2 = new TiledMap(10, 10, 32, 32)
  const project2 = Projects.add(tiledMap2)
  component.setAttribute('projectId', project2.projectId.toString())

  expect(project.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(0)
  expect(project2.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(1)
})

test('The cursor should not be displayed when the project is not found', async () => {
  const component = await setComponent(`projectId="99999"`)

  expect(component.shadowRoot?.innerHTML).not.toContain('class="cursor"')
})

test('The cursor should not be displayed when the map-chip is not found', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId} chipId="99999"`)

  expect(component.shadowRoot?.innerHTML).not.toContain('class="cursor"')
})

test('Should replace the image when map-chip is replaced', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const chipImage = new MapChipImage('dummy.png', 1)
  tiledMap.mapChipsCollection.push(chipImage)

  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId} chipId=${chipImage.id}`)

  tiledMap.mapChipsCollection.replace(new MapChipImage('dummy-replaced.png', 1))
  await component.updateComplete

  expect(component.shadowRoot?.innerHTML).toContain('src="dummy-replaced.png"')
})
