import { TiledMap } from './TiledMap'
import { MapChipSelector } from './MapChipSelector'

export class Project {
  private _mapChipSelector = new MapChipSelector(this._tiledMap)

  constructor(
    private _tiledMap: TiledMap,
    private _projectId: number
  ) {

  }

  get mapChipSelector() {
    return this._mapChipSelector
  }

  get projectId() {
    return this._projectId
  }

  get tiledMap() {
    return this._tiledMap
  }
}

export class Projects {
  private static _idCounter = 0
  private static _items: Array<Project> = []

  static add(tiledMap: TiledMap, projectId: number = -1) {
    const id = projectId > 0 ? projectId : Projects.createId()
    Projects._items.push(new Project(tiledMap, id))
  }

  static fromProjectId(projectId: number): Project | null {
    return this._items.find( item => item.projectId === projectId ) || null
  }

  private static createId() {
    return Projects._idCounter++
  }
}
