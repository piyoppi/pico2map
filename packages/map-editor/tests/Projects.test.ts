import { Projects } from './../src/Projects'
import { TiledMap } from '@piyoppi/tiled-map'

describe('#add', () => {
  it('Should add a project', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    Projects.add(tiledMap)

    expect(Projects.items[0].tiledMap).toEqual(tiledMap)
    expect(Projects.items[0].projectId).toEqual(1)

    Projects.add(tiledMap)
    expect(Projects.items[1].projectId).toEqual(2)

    Projects.add(tiledMap, 100)
    expect(Projects.items[2].projectId).toEqual(100)
  })
})

describe('#fromProjectId', () => {
  it('Should return a project', () => {
    const tiledMap = new TiledMap(30, 30, 32, 32)
    Projects.add(tiledMap, 1)
    Projects.add(tiledMap, 2)
    Projects.add(tiledMap, 3)

    expect(Projects.fromProjectId(2)?.projectId).toEqual(2)
  })

  it('Should return null when project is not found', () => {
    Projects.clear()
    expect(Projects.fromProjectId(2)).toEqual(null)
  })
})
