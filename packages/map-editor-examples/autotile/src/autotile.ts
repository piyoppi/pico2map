import { Projects, defineComponent } from '@piyoppi/pico2map-ui-components'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/pico2map-tiled'

// Define some custom elements
defineComponent()

// Map size is 30 x 30, MapChip size is 32 x 32px
const tiledMap = new TiledMap(30, 30, 32, 32)

// MapChip image (using 'auto-tile-sample.png' and chipId = 1)
const mapChipImage = new MapChipImage("images/auto-tile-sample.png", 1)

const init = async () => {
  await mapChipImage.waitWhileLoading()

  // Attach mapChipImage to tiledMap
  tiledMap.mapChipsCollection.push(mapChipImage)

  // Import autoTile (MapChip size is 32 x 32px)
  tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(mapChipImage, 32, 32))

  // Attach tiledMap to project(projectId: 1)
  Projects.add(tiledMap, 1)
}

init()
