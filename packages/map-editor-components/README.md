# pico2map-ui-components

Web components for tiled-map editor.

## Usage

### Project setting

In order to edit a tiled-map, you need to register it with the project.

```js
const tiledMap = new TiledMap(15, 10, 32, 32)
const mapChipImage = new MapChipImage("images/chip.png", 1)

await mapChipImage.waitWhileLoading()
tiledMap.mapChipsCollection.push(mapChipImage)

tiledMap.mapChipsCollection.waitWhileLoading.then(() => {
  // Attach tiledMap to project(projectId: 1)
  Projects.add(tiledMap, 1)
})
```

### Registration and placement of custom elements

Register custom elements.

```js
import { defineComponent } from '@piyoppi/pico2map-ui-components'
defineComponent()
```

Place the component anywhere in the HTML.

```html
<map-canvas-component
  mapChipFragmentProperties='[{"x": 0, "y": 3, "chipId": 1, "renderingArea": 15}]'
  projectId="1"
></map-canvas-component>
```

See also the [Minimum Example](./packages/map-editor-examples/minimum_example/).

## `<map-canvas-component>`

A component for arranging map chips / auto-tile.

```html
<map-canvas-component
  mapChipFragmentProperties='[{"x": 0, "y": 3, "chipId": 1, "renderingArea": 15}]'
  projectId="1"
></map-canvas-component>
```

| Attribute | Details | Required |
| --- | --- | --- |
| projectId | ID of the project to be edited. | x |
| brush | Brush name (`Pen` or `RectangleBrush`) | |
| arrangement | Arrangement name (`DefaultArrangement` or `DefaultEraseArrangement` or `AutoTileArrangement`) | |
| autoTileId | ID of the auto-tile to be placed. | |
| mapChipFragmentProperties | A properties of the map chip to be placed. | |
| activeLayer | A index of the layer to edit. | |
| gridColor | grid color (default `#000`) | |
| pickFromActiveLayer |  | |

The format of `mapChipFragmentProperties` attribute is as follows.

```js
[
  {
    "x": 0,                 // X position of the chip
    "y": 0,                 // Y position of the chip
    "chipId": 0,            // map-chip id
    "renderingArea": 15     // Rendering area (default 15)
  },
  {
    ...
  },
]
```

## `<map-grid-component>`

A component for showing grid.

| Attribute | Details | Required |
| --- | --- | --- |
| gridColor | grid color (default `#000`) | |
| gridWidth | A width of a map-chip | x |
| gridHeight | A height of a map-chip | x |
| chipCountX | Number of rows of chips | x |
| chipCountY | Number of cols of chips | x |
| cursorHidden | The cursor is hidden if the attribute is given | |


## `<map-chip-selector-component>`

A component for selecting a map chip.

### Attributes

| Attribute | Details | Required |
| --- | --- | --- |
| projectId | ID of the project to be edited. | x |
| chipId | ID of the MapChipImage | x |

### Events

#### mapchip-selected

Emitted when a map chip is selected.

```html
<map-chip-selector-component
  id="selector"
  projectId="1"
></map-chip-selector-component>
```

```js
document.getElementById('selector').addEventListener('mapchip-selected', (e) => {
  console.log(e.detail)
  // log output
  // {selectedMapChipProperties: [{x: 0, y: 3, chipId: 1, renderingArea: 15}]}
})
```


## `<auto-tile-selector-component>`

A component for selecting a auto-tile.

| Attribute | Details | Required |
| --- | --- | --- |
| projectId | ID of the project to be edited. | x |
| width | Width of the component (default `192`) | |

Emitted when a auto-tile is selected.

### Events

#### autotile-selected

Emitted when a auto-tile is selected.

```html
<auto-tile-selector-component
  id="selector"
  projectId="1"
></auto-tile-selector-component>
```

```js
document.getElementById('selector').addEventListener('autotile-selected', (e) => {
  console.log(e.detail)
  // log output
  // {id: 1}
})
```
