import { TiledMap } from '@piyoppi/pico2map-tiled'
import { CallbackCaller } from './Callbacks'
import { Injector } from './Injector'

export class Project {
  private _renderAllFunction: Array<(() => void)> = []
  private _beforeAddLayerCallbacks = new CallbackCaller()

  constructor(
    private _tiledMap: TiledMap,
    private _projectId: number
  ) {
    const injector = new Injector()
    injector.inject(_tiledMap, _tiledMap.addLayer, () => this._beforeAddLayerHandler(), null)
  }

  get projectId() {
    return this._projectId
  }

  get tiledMap() {
    return this._tiledMap
  }

  addBeforeAddLayerCallback(callback: () => void) {
    this._beforeAddLayerCallbacks.add(callback)
  }

  requestRenderAll() {
    this._renderAllFunction.forEach(fn => fn())
  }

  registerRenderAllCallback(fn: () => void) {
    this._renderAllFunction.push(fn)
  }

  private _beforeAddLayerHandler() {
    this._beforeAddLayerCallbacks.call()
  }
}

export class Projects {
  private static _idCounter = 0
  private static _items: Array<Project> = []
  private static _projectAddCallbackFunctions: Array<() => void> = []

  static setProjectAddCallbackFunction(fn: () => void) {
    this._projectAddCallbackFunctions.push(fn)
  }

  static get items() {
    return Projects._items
  }

  static add(tiledMap: TiledMap, projectId: number = -1): Project {
    const id = projectId > 0 ? projectId : Projects.createId()
    const project = new Project(tiledMap, id)

    Projects._items.push(project)

    this._projectAddCallbackFunctions.forEach(fn => fn())

    return project
  }

  static clear() {
    this._items.length = 0
  }

  static fromProjectId(projectId: number): Project | null {
    return this._items.find( item => item.projectId === projectId ) || null
  }

  private static createId() {
    return ++Projects._idCounter
  }
}
