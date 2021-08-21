/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

import { MapChip, MapChipProperties, AutoTileMapChipProperties, isAutoTileMapChipProperties, AutoTileMapChip } from './../MapChip'
import { MapChipImage } from '../MapChipImage'
import { MapPaletteMatrix } from './MapPaletteMatrix'

export type TiledMapDataItem = MapChip | null

export type TiledMapDataProperties = {
  chipCountX: number,
  chipCountY: number,
  values: Array<number>
  palette: Array<MapChipProperties | AutoTileMapChipProperties | null>
}

export class TiledMapData extends MapPaletteMatrix<TiledMapDataItem> {
  filter(needles: Array<MapChip>): TiledMapData {
    const filtered = this.items.map(chip => needles.some(needle => !!chip && needle.compare(chip)) ? chip : null)
    return new TiledMapData(
      this.width,
      this.height,
      filtered
    )
  }

  findByImage(image: MapChipImage) {
    const registeredChips = new Set()
    return this.items.filter(chip => {
      if (!chip) return false

      const found = chip.items.find(fragment => fragment.chipId === image.id) && !registeredChips.has(chip.identifyKey)

      if (found) {
        registeredChips.add(chip.identifyKey)
      }

      return found
    }) as Array<MapChip>
  }

  toObject(): TiledMapDataProperties {
    return {
      chipCountX: this.width,
      chipCountY: this.height,
      values: this.values.items,
      palette: this.palette.map(data => data ? (data as MapChip).toObject() : null)
    }
  }

  static fromObject(val: TiledMapDataProperties) {
    const palette = val.palette.map(data => {
      if (!data) return null

      if (isAutoTileMapChipProperties(data)) {
        return AutoTileMapChip.fromObject(data)
      }

      return MapChip.fromObject(data)
    })

    const tiledMapData = new TiledMapData(val.chipCountX, val.chipCountY, [])
    tiledMapData.setValuePalette(val.values, palette)

    return tiledMapData
  }
}
