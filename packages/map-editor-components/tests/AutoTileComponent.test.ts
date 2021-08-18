import { AutoTileSelectorComponent } from '../src/AutoTileSelectorComponent'
import { Projects } from '@piyoppi/pico2map-editor'
import { TiledMap } from '@piyoppi/pico2map-tiled'

customElements.define('auto-tile-selector-component', AutoTileSelectorComponent)

async function setComponent(attributes: string): Promise<AutoTileSelectorComponent> {
  document.body.innerHTML = `
    <auto-tile-selector-component ${attributes}></auto-tile-selector-component>
  `

  const component = document.getElementsByTagName('auto-tile-selector-component')[0] as AutoTileSelectorComponent
  await component.updateComplete

  return component
}

test('Should set Project to MapCanvas', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent('')

  component.setAttribute('projectId', project.projectId.toString())
  await component.updateComplete

  expect(component.project).toEqual(project)
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

test('Reset subscription of project event when projectId is changed', async () => {
  const tiledMap = new TiledMap(30, 30, 32, 32)
  const project = Projects.add(tiledMap)
  const component = await setComponent(`projectId=${project.projectId}`)

  expect(project.callbacks.getCallbackCaller('afterAddAutoTile')?.length).toEqual(1)
  expect(project.callbacks.getCallbackCaller('afterRemoveAutoTile')?.length).toEqual(1)
  expect(project.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(1)

  const tiledMap2 = new TiledMap(10, 10, 32, 32)
  const project2 = Projects.add(tiledMap2)
  component.setAttribute('projectId', project2.projectId.toString())

  expect(project.callbacks.getCallbackCaller('afterAddAutoTile')?.length).toEqual(0)
  expect(project.callbacks.getCallbackCaller('afterRemoveAutoTile')?.length).toEqual(0)
  expect(project.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(0)
  expect(project2.callbacks.getCallbackCaller('afterAddAutoTile')?.length).toEqual(1)
  expect(project2.callbacks.getCallbackCaller('afterRemoveAutoTile')?.length).toEqual(1)
  expect(project2.callbacks.getCallbackCaller('afterReplacedMapChipImage')?.length).toEqual(1)
})
