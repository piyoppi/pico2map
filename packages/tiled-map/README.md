# pico2map-tiled

A core library of the tiled-map

## Overview

A library for representing resources in 2D tile maps and map chips.

### Create tiled-map

```js
// Map size is 15 x 10, MapChip size is 32 x 32px
const tiledMap = new TiledMap(15, 10, 32, 32)

// MapChip image (using 'chip.png' and chipId = 1)
const mapChipImage = new MapChipImage("images/chip.png", 1)

// Add a map chip to the map
await mapChipImage.waitWhileLoading()
tiledMap.mapChipsCollection.push(mapChipImage)

// Import autoTile (MapChip size is 32 x 32px)
const mapChipImage = new MapChipImage("images/autotile-chip.png", 2)
tiledMap.autoTiles.import(new DefaultAutoTileImportStrategy(mapChipImage, 32, 32))
```

### Serialize / Deserialize

```js
// Serialize
const serialized = tiledMap.toObject()

// Deserialize
import { TiledMap } from '@piyoppi/pico2map-tiled'
const deserialized = TiledMap.fromObject(serialized)
```

### Rendering to canvas

This library also includes a map rendering class.

```js
import { TiledMap } from '@piyoppi/pico2map-tiled'

const tiledMap = TiledMap.fromObject(serialized)
const renderer = new MapRenderer(tiledMap)

// Render all layers
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
renderer.renderAll(ctx)

// Render each layers
const canvases = [
  document.createElement('canvas'),
  document.createElement('canvas'),
  document.createElement('canvas')
]
renderer.renderLayer(0, canvases[0].getContext('2d'))
renderer.renderLayer(1, canvases[1].getContext('2d'))
renderer.renderLayer(1, canvases[2].getContext('2d'))
```
