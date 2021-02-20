# Minimum Example

Minimum map-editor example

`<map-canvas-component>` is used to draw and edit a tiled map.

The `mapChipFragmentProperties` attribute must be set on the `<map-canvas-component>` in order to put the mapchip.

[The sample is here](https://garakuta-toolbox.com/pico2map/minimum_example)

```html
<!--
  mapChipFragmentProperties: Active map chip
  x, y: mapChip position
  chipId: MapChipImage id
-->
<map-canvas-component
  mapChipFragmentProperties='{"x": 0, "y": 3, "chipId": 1, "renderingArea": 15}'
  projectId="1"
></map-canvas-component>

<script src="../dist/minimum_example.bundle.js"></script>
```

```ts
import { Projects } from '@pico2map/map-editor'
import { TiledMap, MapChipImage } from '@pico2map/tiled-map'

// Map size is 15 x 10, MapChip size is 32 x 32px
const tiledMap = new TiledMap(15, 10, 32, 32)

// MapChip image (using 'chip.png' and chipId = 1)
const mapChipImage = new MapChipImage("images/chip.png", 1)

const init = async () => {
  await mapChipImage.waitWhileLoading()
  tiledMap.mapChipsCollection.push(mapChipImage)

  // Attach tiledMap to project(projectId: 1)
  Projects.add(tiledMap, 1)
}

init()
```
