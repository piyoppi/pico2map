import { TiledMap, Projects, MapChipImage } from './../../src/main'

const tiledMap = new TiledMap(30, 30, 32, 32)
tiledMap.mapChipsCollection.push(new MapChipImage("images/chip.png", 1))
tiledMap.mapChipsCollection.push(new MapChipImage("images/auto-tile-sample.png", 2))
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

const init = () => {
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

init()
