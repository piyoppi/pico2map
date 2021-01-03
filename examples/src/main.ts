import { TiledMap, Projects, MapChipImage } from './../../src/main'

const tiledMap = new TiledMap(30, 30, 32, 32)
tiledMap.mapChipsCollection.push(new MapChipImage("images/chip.png", 1))
tiledMap.mapChipsCollection.push(new MapChipImage("images/auto-tile-sample.png", 2))
Projects.add(tiledMap, 1)

const mapChipSelector = document.getElementById('mapChipSelector')
const autoTileSelector = document.getElementById('autoTileSelector')
const mapCanvas = document.getElementById('mapCanvas')

const init = () => {
  if (!mapChipSelector || !autoTileSelector || !mapCanvas) return

  mapChipSelector.setAttribute('projectId', '1')
  autoTileSelector.setAttribute('projectId', '1')
  mapCanvas.setAttribute('projectId', '1')

  autoTileSelector.addEventListener('selected', () => {
    mapCanvas.setAttribute('brush', 'RectangleBrush')
    mapCanvas.setAttribute('arrangement', 'AutoTileArrangement')
  })

  mapChipSelector.addEventListener('selected', () => {
    mapCanvas.setAttribute('brush', 'Pen')
    mapCanvas.setAttribute('arrangement', 'DefaultArrangement')
  })
}

init()
