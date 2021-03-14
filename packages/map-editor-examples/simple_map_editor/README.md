# Simple Map Editor

The simple map editor consists of some components.

- `<map-canvas-component>` : Draw and edit a tiled map
- `<map-chip-selector-component>` : Select a MapChip from an image
- `<auto-tile-selector-component>` : Select a AutoTile from a project

[The sample is here](https://garakuta-toolbox.com/pico2map/simple_map_editor)

```html
<div class="tools">
  <input type="radio" name="tools" id="pen">Pen</input>
  <input type="radio" name="tools" id="rectangle">Rectangle</input>
  <input type="checkbox" id="erase">Erase</input>
  <button id="save">Save</button>
  <button id="load">Load</button>
  <button id="render">Render</button>

  <input type="radio" name="mode" id="mapChipMode">MapChip</input>
  <input type="radio" name="mode" id="coliderMode">Colider</input>
  <div id="coliderGroup" style="display: none;">
    <input type="radio" name="coliderType" id="coliderTypeNone">None</input>
    <input type="radio" name="coliderType" id="coliderTypeColider">Colider</input>
  </div>
</div>
<div class="map-editor-boundary">
  <div class="map-editor">
    <map-canvas-component id="mapCanvas" coliderType="colider"></map-canvas-component>
  </div>
  <div class="chip-selector">
    <div class="map-chips">
      <map-chip-selector-component
        id="mapChipSelector"
        chipId="1"
        ></map-chip-selector-component>
    </div>
    <div class="map-chips">
      <auto-tile-selector-component
        id="autoTileSelector"
        ></auto-tile-selector-component>
    </div>
  </div>
</div>

<script src="../dist/simple_map_editor.bundle.js"></script>
```

```js
import { Projects, defineComponent, MapChipSelectedEvent, AutoTileSelectedEvent } from '@piyoppi/pico2map-ui-components'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/pico2map-tiled'

// Define some custom elements
defineComponent()

// Get some elements
const mapCanvas = document.getElementById('mapCanvas') as HTMLInputElement
const mapChipSelector = document.getElementById('mapChipSelector') as HTMLInputElement
const autoTileSelector = document.getElementById('autoTileSelector') as HTMLInputElement
const loadButton = document.getElementById('load') as HTMLInputElement
const saveButton = document.getElementById('save') as HTMLInputElement
const rectangleRadioButton = document.getElementById('rectangle') as HTMLInputElement
const eraseRadioButton = document.getElementById('erase') as HTMLInputElement
const penRadioButton = document.getElementById('pen') as HTMLInputElement
const mapChipModeRadioButton = document.getElementById('mapChipMode') as HTMLInputElement
const coliderModeRadioButton = document.getElementById('coliderMode') as HTMLInputElement
const coliderGroup = document.getElementById('coliderGroup') as HTMLDivElement
const coliderTypeNoneRadioButton = document.getElementById('coliderTypeNone') as HTMLInputElement
const coliderTypeColiderRadioButton = document.getElementById('coliderTypeColider') as HTMLInputElement

function setProjectId(id: number) {
  mapChipSelector.setAttribute('projectId', id.toString())
  autoTileSelector.setAttribute('projectId', id.toString())
  mapCanvas.setAttribute('projectId', id.toString())
}

async function setMapChip(tiledMap: TiledMap, chipSize: {width: number, height: number}) {
  const mapChipImage = new MapChipImage("images/chip.png", 1)
  const autoTileImage = new MapChipImage("images/auto-tile-sample.png", 2)

  await mapChipImage.waitWhileLoading()
  await autoTileImage.waitWhileLoading()

  tiledMap.mapChipsCollection.push(mapChipImage)
  tiledMap.mapChipsCollection.push(autoTileImage)

  tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(autoTileImage, chipSize.width, chipSize.height))
}

async function initialize() {
  const chipSize = { width: 32, height: 32 }
  let tiledMap = new TiledMap(30, 30, chipSize.width, chipSize.height)

  await setMapChip(tiledMap, chipSize)

  const project = Projects.add(tiledMap)
  setProjectId(project.projectId)

  // Deserialze a data
  loadButton.onclick = async () => {
    const serializedData = localStorage.getItem('mapData')
    if (!serializedData) return
    tiledMap = TiledMap.fromObject(JSON.parse(serializedData))
    const newProject = Projects.add(tiledMap)
    setProjectId(newProject.projectId)
    await newProject.tiledMap.mapChipsCollection.waitWhileLoading()
    newProject.requestRenderAll()
  }

  // Serialize a tiled-map data and set to the localStorage
  saveButton.onclick = () => localStorage.setItem('mapData', JSON.stringify(tiledMap.toObject()))

  // Set a pen
  rectangleRadioButton.addEventListener('change', () => mapCanvas.setAttribute('brush', 'RectangleBrush'))
  penRadioButton.addEventListener('change', () => mapCanvas.setAttribute('brush', 'Pen'))

  // Set eraser arrangement
  // DefaultEraseArrangement put empty MapChips.
  eraseRadioButton.addEventListener('change', () => mapCanvas.setAttribute('arrangement', 'DefaultEraseArrangement'))

  mapChipModeRadioButton.addEventListener('change', e => {
    // Set arrangement map-chips mode
    mapCanvas.setAttribute('mode', 'mapChip')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })
  coliderModeRadioButton?.addEventListener('change', e => {
    // Set colider-edit mode
    mapCanvas.setAttribute('mode', 'colider')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })

  // Set an active colider type
  coliderTypeNoneRadioButton.addEventListener('change', () => mapCanvas?.setAttribute('coliderType', 'none'))
  coliderTypeColiderRadioButton.addEventListener('change', () => mapCanvas?.setAttribute('coliderType', 'colider'))

  autoTileSelector.addEventListener<any>('autotile-selected', (e: AutoTileSelectedEvent) => {
    // Set a AutoTileArrangement.
    // AutoTileArrangement arranges appropriate MapChips.
    mapCanvas.setAttribute('arrangement', 'AutoTileArrangement')
    mapCanvas.setAttribute('brush', 'RectangleBrush')

    // Set an active AutoTile
    mapCanvas.setAttribute('autoTileId', e.detail.id.toString())
    rectangleRadioButton.checked = true
  })

  mapChipSelector.addEventListener<any>('mapchip-selected', (e: MapChipSelectedEvent) => {
    // Set an active MapChip
    mapCanvas.setAttribute('arrangement', 'DefaultArrangement')
    mapCanvas.setAttribute('mapChipFragmentProperties', JSON.stringify(e.detail.selectedMapChipProperties))
  })

  penRadioButton.checked = true
}

initialize()
```
