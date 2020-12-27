import { TiledMap, Projects, MapChipImage } from './../../src/main'

const tiledMap = new TiledMap()
tiledMap.initialize(30, 30, 32, 32)
tiledMap.mapChipsCollection.push(new MapChipImage("images/chip.png", 1))
Projects.add(tiledMap, 1)

document.getElementById('mapChipSelector')?.setAttribute('projectId', '1')
document.getElementById('mapCanvas')?.setAttribute('projectId', '1')
