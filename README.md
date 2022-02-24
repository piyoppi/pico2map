# pico2map

[![ci](https://github.com/piyoppi/pico2map/actions/workflows/ci.yml/badge.svg)](https://github.com/piyoppi/pico2map/actions/workflows/ci.yml)

Map editor for game development that runs in a browser.
This repository contains the 2D tiled-map library and editor.

example: https://piyoppi.github.io/pico2map/simple_map_editor/

This library is still under development and will be upgraded frequently.

## Packages

| Package | Summary |
| --- | --- |
| [pico2map-tiled](packages/tiled-map) | A core library of the tiled-map |
| [pico2map-tiled-colision-detector](packages/tiled-colision-detector) | A colision detection library for tiled-map |
| [pico2map-editor](packages/map-editor) | A core libarary of the tiled-map editor |
| [pico2map-ui-components](packages/map-editor-components) | Web components for tiled-map editor |

## Install

To get packages from github, you should edit `.npmrc` file. Show an example below.
(`authToken` must have the `read:packages` scope. [ref](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages))

```
//npm.pkg.github.com/:_authToken=xxxxxxxx
@piyoppi:registry=https://npm.pkg.github.com
```

```
npm install --save @piyoppi/pico2map-editor
```

## Sample

- [Minimum Example](./packages/map-editor-examples/minimum_example/)
- [AutoTile](./packages/map-editor-examples/autotile/)
- [Simple Map Editor](./packages/map-editor-examples/simple_map_editor/)

## License

[MIT](./LICENSE)
