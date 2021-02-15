import { Projects } from '@piyoppi/map-editor'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/tiled-map'

const tiledMap = new TiledMap(30, 30, 32, 32)
const mapChipImage = new MapChipImage("images/auto-tile-sample.png", 1)

const init = async () => {
  await mapChipImage.waitWhileLoading()
  tiledMap.mapChipsCollection.push(mapChipImage)
  tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(mapChipImage, 32, 32))
  Projects.add(tiledMap, 1)
}

init()
