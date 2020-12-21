import { TiledMap, Projects } from './../../src/main'

const tiledMap = new TiledMap()
tiledMap.initialize(10, 10, 32, 32)
Projects.add(tiledMap, 1)

document.getElementById('mapChipSelector')?.setAttribute('projectId', '1')
document.getElementById('mapCanvas')?.setAttribute('projectId', '1')
