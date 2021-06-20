import { TiledMap, TiledMapDataItem } from '@piyoppi/pico2map-tiled'

export class MapChipPicker {
  constructor(
    private _tiledMap: TiledMap
  ) {

  }

  pick(x: number, y: number): TiledMapDataItem {
    return this._tiledMap.datas.reduce((acc: TiledMapDataItem, data) => {
      const chip = data.getFromChipPosition(x, y)
      if (chip) return chip

      return acc
    }, null)
  }
}
