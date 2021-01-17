import { TiledMap, Projects, MapChipImage, DefaultAutoTileImportStrategy } from './../../src/main'

async function initialize() {
  const chipSize = { width: 32, height: 32 }
  const tiledMap = new TiledMap(30, 30, chipSize.width, chipSize.height)

  const mapChipImage = new MapChipImage("images/chip.png", 1)
  const autoTileImage = new MapChipImage("images/auto-tile-sample.png", 2)

  await mapChipImage.waitWhileLoading()
  await autoTileImage.waitWhileLoading()

  tiledMap.mapChipsCollection.push(mapChipImage)
  tiledMap.mapChipsCollection.push(autoTileImage)

  const autoTileImportStrategy = new DefaultAutoTileImportStrategy(autoTileImage, chipSize.width, chipSize.height)
  tiledMap.autoTiles.import(autoTileImportStrategy)

  Projects.add(tiledMap, 1)

  const rectangleRadioButton = document.getElementById('rectangle') as HTMLInputElement
  const eraseRadioButton = document.getElementById('erase') as HTMLInputElement
  const penRadioButton = document.getElementById('pen') as HTMLInputElement

  const mapChipSelector = document.getElementById('mapChipSelector')
  const autoTileSelector = document.getElementById('autoTileSelector')
  const mapCanvas = document.getElementById('mapCanvas')

  rectangleRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('brush', 'RectangleBrush'))
  penRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('brush', 'Pen'))
  eraseRadioButton?.addEventListener('change', () => mapCanvas?.setAttribute('arrangement', 'EraseArrangement'))

  penRadioButton.checked = true

  if (!mapChipSelector || !autoTileSelector || !mapCanvas) return

  mapChipSelector.setAttribute('projectId', '1')
  autoTileSelector.setAttribute('projectId', '1')
  mapCanvas.setAttribute('projectId', '1')

  autoTileSelector.addEventListener('selected', () => {
    mapCanvas.setAttribute('brush', 'RectangleBrush')
    mapCanvas.setAttribute('arrangement', 'AutoTileArrangement')
    rectangleRadioButton.checked = true
  })

  mapChipSelector.addEventListener('selected', () => {
    mapCanvas.setAttribute('arrangement', 'DefaultArrangement')
  })
}

initialize()
