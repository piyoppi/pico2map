# AutoTile Example

AutoTile makes it easy to build RPG-like fields.

The `autoTileId` attribute must be set on the `<map-canvas-component>` in order to put the AutoTile.

[The sample is here](./index.html)

```html
<map-canvas-component
  autoTileId="1"
  brush="RectangleBrush"
  arrangement="AutoTileArrangement"
  projectId="1"
  ></map-canvas-component>

<script src="../dist/autotile.bundle.js"></script>
```

```ts
import { Projects } from '@piyoppi/map-editor'
import { TiledMap, MapChipImage, DefaultAutoTileImportStrategy } from '@piyoppi/tiled-map'

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
```
