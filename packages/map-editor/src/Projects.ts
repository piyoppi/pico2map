import { TiledMap } from '@piyoppi/tiled-map'

export class Project {
  private _renderAllFunction: Array<(() => void)> = []

  constructor(
    private _tiledMap: TiledMap,
    private _projectId: number
  ) {
  }

  get projectId() {
    return this._projectId
  }

  get tiledMap() {
    return this._tiledMap
  }

  setTiledMap(map: TiledMap) {
    this._tiledMap = map
  }

  requestRenderAll() {
    this._renderAllFunction.forEach(fn => fn())
  }

  registerRenderAllCallback(fn: () => void) {
    this._renderAllFunction.push(fn)
  }
}

export class Projects {
  private static _idCounter = 0
  private static _items: Array<Project> = []

  static get items() {
    return Projects._items
  }

  static add(tiledMap: TiledMap, projectId: number = -1): Project {
    const id = projectId > 0 ? projectId : Projects.createId()
    const project = new Project(tiledMap, id)
    Projects._items.push(project)

    return project
  }

  static clear() {
    this._items.length = 0
  }

  static fromProjectId(projectId: number): Project | null {
    return this._items.find( item => item.projectId === projectId ) || null
  }

  private static createId() {
    return Projects._idCounter++
  }
}
