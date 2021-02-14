import { Projects, MapChipSelectedEvent, AutoTileSelectedEvent } from '@piyoppi/map-editor'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/tiled-map'

const mapCanvas = document.getElementById('mapCanvas') as HTMLInputElement
const mapChipSelector = document.getElementById('mapChipSelector') as HTMLInputElement
const autoTileSelector = document.getElementById('autoTileSelector') as HTMLInputElement

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

  const loadButton = document.getElementById('load') as HTMLInputElement
  loadButton.onclick = async () => {
    const serializedData = localStorage.getItem('mapData')
    if (!serializedData) return
    tiledMap = TiledMap.fromObject(JSON.parse(serializedData))

    const project = Projects.add(tiledMap)
    setProjectId(project.projectId)
    await project.tiledMap.mapChipsCollection.waitWhileLoading()
    project.requestRenderAll()
  }

  const saveButton = document.getElementById('save') as HTMLInputElement
  saveButton.onclick = () => localStorage.setItem('mapData', JSON.stringify(tiledMap.toObject()))

  const renderButton = document.getElementById('render') as HTMLInputElement
  renderButton.onclick = () => {
    project.requestRenderAll()
  }

  const rectangleRadioButton = document.getElementById('rectangle') as HTMLInputElement
  const eraseRadioButton = document.getElementById('erase') as HTMLInputElement
  const penRadioButton = document.getElementById('pen') as HTMLInputElement
  const mapChipModeRadioButton = document.getElementById('mapChipMode') as HTMLInputElement
  const coliderModeRadioButton = document.getElementById('coliderMode') as HTMLInputElement
  const coliderGroup = document.getElementById('coliderGroup') as HTMLDivElement
  const coliderTypeNoneRadioButton = document.getElementById('coliderTypeNone') as HTMLInputElement
  const coliderTypeColiderRadioButton = document.getElementById('coliderTypeColider') as HTMLInputElement

  rectangleRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('brush', 'RectangleBrush'))
  penRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('brush', 'Pen'))
  eraseRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('arrangement', 'DefaultEraseArrangement'))
  mapChipModeRadioButton?.addEventListener('change', e => {
    mapCanvas?.setAttribute('mode', 'mapChip')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })
  coliderModeRadioButton?.addEventListener('change', e => {
    mapCanvas?.setAttribute('mode', 'colider')

    coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none'
  })
  coliderTypeNoneRadioButton.addEventListener('change', () => mapCanvas?.setAttribute('coliderType', 'none'))
  coliderTypeColiderRadioButton.addEventListener('change', () => mapCanvas?.setAttribute('coliderType', 'colider'))

  penRadioButton.checked = true

  setProjectId(project.projectId)

  autoTileSelector.addEventListener<any>('autotile-selected', (e: AutoTileSelectedEvent) => {
    mapCanvas.setAttribute('brush', 'RectangleBrush')
    mapCanvas.setAttribute('arrangement', 'AutoTileArrangement')
    mapCanvas.setAttribute('autoTileId', e.detail.id.toString())
    rectangleRadioButton.checked = true
  })

  mapChipSelector.addEventListener<any>('mapchip-selected', (e: MapChipSelectedEvent) => {
    mapCanvas.setAttribute('arrangement', 'DefaultArrangement')
    mapCanvas.setAttribute('mapChipFragmentProperties', JSON.stringify(e.detail.selectedMapChipProperties))
  })
}

initialize()
