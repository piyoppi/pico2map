import { TiledMap, Projects, MapChipImage } from './../../src/main'

const tiledMap = new TiledMap(30, 30, 32, 32)
const mapChipImage = new MapChipImage("images/auto-tile-sample.png", 1)
tiledMap.mapChipsCollection.push(mapChipImage)
Projects.add(tiledMap, 1)

const mapCanvas = document.getElementById('mapCanvas')

const init = async () => {
  // [TODO] refactor
  const waitForPrepare = () => {
    return new Promise<void>(resolve => {
      const waitHandler = () => {
        if(!mapChipImage.hasImage) {
          setTimeout(waitHandler, 100)
        } else {
          resolve()
        }
      }
      waitHandler()
    })
  }

  await waitForPrepare()

  const project = Projects.fromProjectId(1)
  if (!mapCanvas || !project) return

  mapCanvas.setAttribute('projectId', '1')

  project.mapChipSelector.selectAtMouseCursor(mapChipImage, 0, 0, 1, 5)

  mapCanvas.setAttribute('brush', 'RectangleBrush')
  mapCanvas.setAttribute('arrangement', 'AutoTileArrangement')
}

init()
