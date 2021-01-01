import { MapChip, MultiMapChip } from '../../MapChip';
import { Arrangement } from './Arrangement';
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap';

/**
 * AutoTileArrangement
 *
 * Supported auto tile format is shown below.
 *
 * |<---------- 1chip ----------->|
 * ┏━┿┿┿┿┿┿┿┿┓---
 * ┠isolated                   ┠↑
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠straight road (lengthwise) ┠ |
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠straight road (sideways)   ┠5chips
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠cross road                 ┠ |
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠square                     ┠↓
 * ┗┷┿┿┿┿┿┿┿┿┛---
 */
export class AutoTileArrangement implements Arrangement {
  private _mapChips: Array<MapChip> = []
  private _tiledMapData: TiledMapData | null = null

  setMapChips(mapChips: Array<MapChip>) {
    if (mapChips.length !== 5) throw new Error()
    this._mapChips = mapChips 
  }

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    if (!this._tiledMapData) throw new Error()

    const result: Array<BrushPaint> = []
    const x1 = paints.reduce((acc, val) => Math.min(acc, val.x), this._tiledMapData.width)
    const y1 = paints.reduce((acc, val) => Math.min(acc, val.y), this._tiledMapData.height)
    const x2 = paints.reduce((acc, val) => Math.max(acc, val.x), 0)
    const y2 = paints.reduce((acc, val) => Math.max(acc, val.y), 0)
    const size = {
      width: x2 - x1 + 1,
      height: y2 - y1 + 1
    }
    const sizeWithPatch = {
      width: size.width + 2,
      height: size.height + 2
    }
    const tiledBuffer = new TiledMapData(sizeWithPatch.width, sizeWithPatch.height)
    const offsetX1 = 1
    const offsetY1 = 1
    const offsetX2 = 1
    const offsetY2 = 1

    tiledBuffer.transferFromTiledMapData(this._tiledMapData, x1 - offsetX1, y1 - offsetY1, sizeWithPatch.width + offsetX2, sizeWithPatch.height + offsetY2, 0, 0)

    paints.forEach(paint => {
      tiledBuffer.put(this._mapChips[0], paint.x - x1 + offsetX1, paint.y - y1 + offsetY1)
    })

    for(let y = 1; y <= size.height; y++) {
      for(let x = 1; x <= size.width; x++) {
        if (!tiledBuffer.getMapDataFromChipPosition(x, y)) continue
       /**
        * adjacent 
        *
        *  x      : processing point
        *  others : patch number
        * *-----*-----*-----*
        * | 16  |  1  | 32  |
        * *-----*-----*-----*
        * |  2  |  x  |  4  |
        * *-----*-----*-----*
        * | 64  |  8  | 128 |
        * *-----*-----*-----*
        */
        let adjacent = 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x, y - 1)) ? 1 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x - 1, y)) ? 2 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x + 1, y)) ? 4 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x, y + 1)) ? 8 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x - 1, y - 1)) ? 16 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x + 1, y - 1)) ? 32 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x - 1, y + 1)) ? 64 : 0
        adjacent += this._isAutoTileChip(tiledBuffer.getMapDataFromChipPosition(x + 1, y + 1)) ? 128 : 0

        result.push({x: x + x1 - offsetX1, y: y + y1 - offsetY1, chip: this.getTiledPattern(adjacent)})
      }
    }

    return result
  }

  private getTiledPattern(adjacent: number) {
    const multiMapChip = new MultiMapChip()

    if ((adjacent & 3) === 2) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 1}))
    } else if ((adjacent & 3) === 1) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 1}))
    } else if ((adjacent & 19) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 1}))
    } else if ((adjacent & 19) === 19) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 1}))
    } else if ((adjacent & 19) === 3) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 1}))
    }

    if ((adjacent & 5) === 4) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 5) === 1) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 37) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 37) === 37) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 37) === 5) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 2}))
    }

    if ((adjacent & 10) === 2) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 10) === 8) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 74) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 74) === 74) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 74) === 10) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 4}))
    }

    if ((adjacent & 12) === 4) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 8}))
    } else if ((adjacent & 12) === 8) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 8}))
    } else if ((adjacent & 140) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 8}))
    } else if ((adjacent & 140) === 140) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 8}))
    } else if ((adjacent & 140) === 12) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 8}))
    }

    return multiMapChip
  }

  private _isAutoTileChip(chip: MapChip | MultiMapChip | null) {
    if (!chip) return false

    if (chip instanceof MultiMapChip) {
      return this._mapChips.some(autoTileChip => autoTileChip.compare(chip.items[0]))
    } else {
      return this._mapChips.some(autoTileChip => autoTileChip.compare(chip))
    }
  }
}
