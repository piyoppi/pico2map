/**
 * @license
 * Copyright (c) 2021 piyoppi.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { MapChip } from './MapChip'
import { MapChipsCollection, MapChipCollectionProperties } from './MapChipsCollection'
import { AutoTiles, AutoTilesProperties } from './AutoTile/AutoTiles'
import { TiledMapData, TiledMapDataProperties } from './MapData/TiledMapData'
import { ColiderMap, ColiderMapProperties } from './MapData/ColiderMap'

export type TiledMapProperties = {
  chipCountX: number,
  chipCountY: number,
  chipWidth: number,
  chipHeight: number,
  mapChipImages: MapChipCollectionProperties,
  autoTiles: AutoTilesProperties,
  tiledMapDatas: Array<TiledMapDataProperties>,
  coliders: ColiderMapProperties
}

export class TiledMap {
  private _mapChipImages = new MapChipsCollection()
  private _autoTiles = new AutoTiles()
  private _datas: Array<TiledMapData> = []
  private _coliders = new ColiderMap(this._chipCountX, this._chipCountY)

  constructor(
    private _chipCountX: number,
    private _chipCountY: number,
    private _chipWidth: number,
    private _chipHeight: number
  ) {
    this.addLayer()
  }

  get chipWidth() {
    return this._chipWidth
  }

  get chipHeight() {
    return this._chipHeight
  }

  get chipCountX() {
    return this._chipCountX
  }

  get chipCountY() {
    return this._chipCountY
  }

  get mapChipsCollection() {
    return this._mapChipImages
  }

  get autoTiles() {
    return this._autoTiles
  }

  get datas() {
    return this._datas
  }

  get coliders() {
    return this._coliders
  }

  convertChipPositionToPixel(chipX: number, chipY: number) {
    return {
      x: chipX * this.chipWidth,
      y: chipY * this.chipHeight
    }
  }

  put(mapChip: MapChip | null, chipX: number, chipY: number, index: number) {
    this._datas[index].put(mapChip, chipX, chipY)
  }

  toObject(): TiledMapProperties {
    return {
      chipCountX: this._chipCountX,
      chipCountY: this._chipCountY,
      chipWidth: this._chipWidth,
      chipHeight: this._chipHeight,
      mapChipImages: this._mapChipImages.toObject(),
      autoTiles: this._autoTiles.toObject(),
      tiledMapDatas: this._datas.map(data => data.toObject()),
      coliders: this._coliders.toObject()
    }
  }

  addLayer() {
    this._datas.push(new TiledMapData(this._chipCountX, this._chipCountY))
  }

  convertMapNumberToPosition(num: number) {
    return {
      x: num % this._chipCountX,
      y: Math.floor(num / this._chipCountX)
    }
  }

  resize(chipCountX: number, chipCountY: number) {
    this._chipCountX = chipCountX
    this._chipCountY = chipCountY

    this._datas.forEach(item => item.resize(chipCountX, chipCountY, null))
    this._coliders.resize(chipCountX, chipCountY, 0)
  }

  private setSerializedProperties(val: {mapChipImages: MapChipCollectionProperties, autoTiles: AutoTilesProperties, tiledMapDatas: Array<TiledMapDataProperties>, coliders: ColiderMapProperties}) {
    this._mapChipImages.fromObject(val.mapChipImages)
    this._autoTiles.fromObject(val.autoTiles)
    this._datas = val.tiledMapDatas.map(tiledMapData => TiledMapData.fromObject(tiledMapData))
    this._coliders = ColiderMap.fromObject(val.coliders)
  }

  static fromObject(val: TiledMapProperties) {
    const tiledMap = new TiledMap(val.chipCountX, val.chipCountY, val.chipWidth, val.chipHeight)
    tiledMap.setSerializedProperties({mapChipImages: val.mapChipImages, autoTiles: val.autoTiles, tiledMapDatas: val.tiledMapDatas, coliders: val.coliders})

    return tiledMap
  }
}
