# pico2map

Map editor for game development that runs in a browser.

example: https://garakuta-toolbox.com/pico2map/simple_map_editor/

This library is still under development and will be upgraded frequently.

## Install

To get packages from github, you should edit `.npmrc` file. Show an example below.
(`authToken` must have the `read:packages` scope. [ref](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages))

```
//npm.pkg.github.com/:_authToken=xxxxxxxx
@piyoppi:registry=https://npm.pkg.github.com
```

```
npm install --save @piyoppi/pico2map-editor@0.0.16
```

## Sample

- [Minimum Example](./packages/map-editor-examples/minimum_example/)
- [AutoTile](./packages/map-editor-examples/autotile/)
- [Simple Map Editor](./packages/map-editor-examples/simple_map_editor/)
