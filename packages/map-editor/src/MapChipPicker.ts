import { TiledMap, TiledMapDataItem } from '@piyoppi/pico2map-tiled'

export class MapChipPicker {
  constructor(
    private _tiledMap: TiledMap
  ) {

  }

  pick(x: number, y: number): TiledMapDataItem {
    return this._tiledMap.datas.reverse().reduce((acc: TiledMapDataItem, data) =>  acc ||= data.getFromChipPosition(x, y), null)
  }
}
