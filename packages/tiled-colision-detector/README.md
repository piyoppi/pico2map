# pico2map-tiled-colision-detector

A colision detection library for tiled-map

## Usage

The following is an example of adjusting the position of an item that has collided with a map chip.

```js
// Deserialize TiledMap
import { TiledMap } from '@piyoppi/pico2map-tiled'
const deserialized = TiledMap.fromObject(serialized)

import { TiledColisionDetector } from '@piyoppi/pico2map-tiled-colision-detector'
const detector = new TiledColisionDetector(tiledMap.coliders, tiledMap.chipWidth, tiledMap.chipHeight)

const item = {
  x: 30,
  y: 30,
  width: 32,
  height: 32
}

// get the amount of overlap between items and collided map chips
const overlapped = this._detector.solveOverlapped(item);

// solve overlapped
item.x += overlapped.x
item.y += overlapped.y
```
