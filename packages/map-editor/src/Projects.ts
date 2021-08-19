import { TiledMap } from '@piyoppi/pico2map-tiled'
import { CallbackCaller } from './CallbackCaller'
import { CallbackCallers } from './CallbackCallers'
import { CallbackItem } from './CallbackItem'
import { Injector } from './Injector'

export type ProjectCallbackKeys =
  'renderAll' |
  'beforeAddLayer' |
  'afterAddAutoTile' |
  'afterRemoveAutoTile' |
  'afterReplacedMapChipImage' |
  'afterResizedMap'

export class Project {
  private _callbacks = new CallbackCallers()

  constructor(
    private _tiledMap: TiledMap,
    private _projectId: number
  ) {
    const injector = new Injector()
    injector.inject(_tiledMap, _tiledMap.addLayer, () => this._beforeAddLayerHandler(), null)
    injector.inject(_tiledMap, _tiledMap.resize, null, () => this._afterResizedMapHandler())
    injector.inject(_tiledMap.autoTiles, _tiledMap.autoTiles.push, null, () => this._afterAddAutoTileHandler())
    injector.inject(_tiledMap.autoTiles, _tiledMap.autoTiles.remove, null, () => this._afterRemoveAutoTileHandler())
    injector.inject(_tiledMap.mapChipsCollection, _tiledMap.mapChipsCollection.replace, null, () => this._afterReplacedMapChipImageHandler())
  }

  get callbacks() {
    return this._callbacks
  }

  get projectId() {
    return this._projectId
  }

  get tiledMap() {
    return this._tiledMap
  }

  requestRenderAll() {
    this._callbacks.call('renderAll')
  }

  setCallback(key: ProjectCallbackKeys, callback: () => void) {
    return this._callbacks.add(key, callback)
  }

  removeCallback(key: ProjectCallbackKeys, callbackItem: CallbackItem) {
    this._callbacks.remove(key, callbackItem)
  }

  private _beforeAddLayerHandler() {
    this._callbacks.call('beforeAddLayer')
  }

  private _afterAddAutoTileHandler() {
    this._callbacks.call('afterAddAutoTile')
  }

  private _afterRemoveAutoTileHandler() {
    this._callbacks.call('afterRemoveAutoTile')
  }

  private _afterReplacedMapChipImageHandler() {
    this._callbacks.call('afterReplacedMapChipImage')
  }

  private _afterResizedMapHandler() {
    this._callbacks.call('afterResizedMap')
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
