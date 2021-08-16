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
