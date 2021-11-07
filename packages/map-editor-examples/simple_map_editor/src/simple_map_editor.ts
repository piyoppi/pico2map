import { Projects, defineComponent, MapChipSelectedEvent, AutoTileSelectedEvent, PickedArrangementSelector } from '@piyoppi/pico2map-ui-components'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy, isAutoTileMapChip } from '@piyoppi/pico2map-tiled'

// Define some custom elements
defineComponent()

// Get some elements
const mapCanvas = document.getElementById('mapCanvas') as HTMLInputElement
const coliderCanvas = document.getElementById('coliderCanvas') as HTMLInputElement
const mapChipSelector = document.getElementById('mapChipSelector') as HTMLInputElement
const autoTileSelector = document.getElementById('autoTileSelector') as HTMLInputElement
const loadButton = document.getElementById('load') as HTMLInputElement
const saveButton = document.getElementById('save') as HTMLInputElement
const addLayerButton = document.getElementById('addlayer') as HTMLInputElement
const rectangleRadioButton = document.getElementById('rectangle') as HTMLInputElement
const eraseRadioButton = document.getElementById('erase') as HTMLInputElement
const penRadioButton = document.getElementById('pen') as HTMLInputElement
const mapChipModeRadioButton = document.getElementById('mapChipMode') as HTMLInputElement
const coliderModeRadioButton = document.getElementById('coliderMode') as HTMLInputElement
const coliderGroup = document.getElementById('coliderGroup') as HTMLDivElement
const coliderTypeNoneRadioButton = document.getElementById('coliderTypeNone') as HTMLInputElement
const coliderTypeColiderRadioButton = document.getElementById('coliderTypeColider') as HTMLInputElement
const layerSelector = document.getElementById('layer') as HTMLInputElement

coliderCanvas.style.display = 'none'

function setProjectId(id: number) {
  mapChipSelector.setAttribute('projectId', id.toString())
  autoTileSelector.setAttribute('projectId', id.toString())
  mapCanvas.setAttribute('projectId', id.toString())
  coliderCanvas.setAttribute('projectId', id.toString())
}

async function initialize() {
  const mapChipImage = new MapChipImage("images/chip.png", 1)
  const autoTileImage = new MapChipImage("images/auto-tile-sample.png", 2)
  await mapChipImage.waitWhileLoading()
  await autoTileImage.waitWhileLoading()

  const chipSize = { width: 32, height: 32 }
  let tiledMap = new TiledMap(30, 30, chipSize.width, chipSize.height)
  tiledMap.addLayer()
  tiledMap.addLayer()

  // import MapChipImage and setup AutoTiles
  tiledMap.mapChipsCollection.push(mapChipImage)
  tiledMap.mapChipsCollection.push(autoTileImage)
  tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(autoTileImage, chipSize.width, chipSize.height))

  const project = Projects.add(tiledMap)
  setProjectId(project.projectId)

  // Deserialze a data
  loadButton.onclick = async () => {
    const serializedData = localStorage.getItem('mapData')
    if (!serializedData) return
    tiledMap = TiledMap.fromObject(JSON.parse(serializedData))
    // The image needs to be set again
    tiledMap.mapChipsCollection.push(mapChipImage)
    tiledMap.mapChipsCollection.push(autoTileImage)
    const newProject = Projects.add(tiledMap)
    setProjectId(newProject.projectId)

    layerSelector.innerHTML = ''
    tiledMap.datas.forEach((_, index) => layerSelector.appendChild(new Option(index.toString(), index.toString())))
  }

  // Serialize a tiled-map data and set to the localStorage
  saveButton.onclick = () => localStorage.setItem('mapData', JSON.stringify(tiledMap.toObject()))

  mapCanvas.addEventListener('touchmove', e => { if (e.touches.length < 2) e.preventDefault() })
  coliderCanvas.addEventListener('touchmove', e => { if (e.touches.length < 2) e.preventDefault() })

  // Set a pen
  rectangleRadioButton.addEventListener('change', () => {
    mapCanvas.setAttribute('brush', 'RectangleBrush')
    coliderCanvas.setAttribute('brush', 'RectangleBrush')
  })
  penRadioButton.addEventListener('change', () => {
    mapCanvas.setAttribute('brush', 'Pen')
    coliderCanvas.setAttribute('brush', 'Pen')
  })

  // Set eraser arrangement
  // DefaultEraseArrangement put empty MapChips.
  eraseRadioButton.addEventListener('change', () => mapCanvas.setAttribute('arrangement', 'DefaultEraseArrangement'))

  mapChipModeRadioButton.addEventListener('change', _ => {
    // Set arrangement map-chips mode
    coliderCanvas.style.display = 'none'
    mapCanvas.removeAttribute('cursorHidden')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })
  coliderModeRadioButton?.addEventListener('change', _ => {
    // Set colider-edit mode
    coliderCanvas.style.display = 'block'
    mapCanvas.setAttribute('cursorHidden', 'true')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })

  // Set an active colider type
  coliderTypeNoneRadioButton.addEventListener('change', () => {
    coliderCanvas?.setAttribute('coliderType', '0')
    coliderCanvas?.setAttribute('subColiderType', '1')
  })
  coliderTypeColiderRadioButton.addEventListener('change', () => {
    coliderCanvas?.setAttribute('coliderType', '1')
    coliderCanvas?.setAttribute('subColiderType', '0')
  })

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

  mapCanvas.addEventListener<any>('mapchip-picked', e => {
    mapCanvas.setAttribute('arrangement', PickedArrangementSelector(e.detail))
  })

  layerSelector.addEventListener('change', e => {
    if (!(e.target instanceof HTMLSelectElement)) return

    mapCanvas.setAttribute('activeLayer', e.target.value)
  })

  addLayerButton.addEventListener('click', () => {
    tiledMap.addLayer()
    const currentLayerIndex = tiledMap.datas.length - 1
    layerSelector.appendChild(new Option(currentLayerIndex.toString(), currentLayerIndex.toString()))
  })

  penRadioButton.checked = true
}
initialize()
