import { TiledMap, Projects, MapChips } from './../../src/main'

const tiledMap = new TiledMap()
tiledMap.initialize(10, 10, 32, 32)
tiledMap.mapChipsCollection.push(new MapChips("images/chip.png", 1))
Projects.add(tiledMap, 1)

document.getElementById('mapChipSelector')?.setAttribute('projectId', '1')
document.getElementById('mapCanvas')?.setAttribute('projectId', '1')
