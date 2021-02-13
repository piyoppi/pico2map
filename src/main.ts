import { Projects, MapChipSelectedEvent, AutoTileSelectedEvent } from '@piyoppi/map-editor'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/tiled-map'

async function initialize() {
  const chipSize = { width: 32, height: 32 }
  let tiledMap = new TiledMap(30, 30, chipSize.width, chipSize.height)

  const mapChipImage = new MapChipImage("images/chip.png", 1)
  const autoTileImage = new MapChipImage("images/auto-tile-sample.png", 2)

  await mapChipImage.waitWhileLoading()
  await autoTileImage.waitWhileLoading()

  tiledMap.mapChipsCollection.push(mapChipImage)
  tiledMap.mapChipsCollection.push(autoTileImage)

  tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(autoTileImage, chipSize.width, chipSize.height))

  const project = Projects.add(tiledMap, 1)

  const loadButton = document.getElementById('load') as HTMLInputElement
  loadButton.onclick = async () => {
    const serializedData = localStorage.getItem('mapData')
    if (!serializedData) return
    tiledMap = TiledMap.fromObject(JSON.parse(serializedData))
    project.setTiledMap(tiledMap)
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
  const mapCanvas = document.getElementById('mapCanvas')
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

  const mapChipSelector = document.getElementById('mapChipSelector')
  const autoTileSelector = document.getElementById('autoTileSelector')

  if (!mapChipSelector || !autoTileSelector || !mapCanvas) return

  mapChipSelector.setAttribute('projectId', '1')
  autoTileSelector.setAttribute('projectId', '1')
  mapCanvas.setAttribute('projectId', '1')

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
