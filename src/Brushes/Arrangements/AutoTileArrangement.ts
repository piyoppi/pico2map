import { MapChip, MultiMapChip } from '../../MapChip';
import { Arrangement, ArrangementDescription, TiledMapDataRequired } from './Arrangement';
import { BrushPaint } from './../Brush'
import { TiledMapData } from '../../TiledMap';

export const AutoTileArrangementDescription: ArrangementDescription = {
  name: 'AutoTileArrangement',
  create: () => new AutoTileArrangement()
}

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
export class AutoTileArrangement implements Arrangement, TiledMapDataRequired {
  private _mapChips: Array<MapChip> = []
  private _tiledMapData: TiledMapData | null = null
  private temporaryChip = new MapChip(-1, -1, -1)

  setMapChips(mapChips: Array<MapChip>) {
    if (mapChips.length !== 5) throw new Error('Too few map chips. AutoTileArrangement requires 5 map chips.')
    this._mapChips = mapChips 
  }

  setTiledMapData(tiledMapData: TiledMapData) {
    this._tiledMapData = tiledMapData 
  }

  apply(paints: Array<BrushPaint>): Array<BrushPaint> {
    if (!this._tiledMapData) throw new Error('MapData is not set.')

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

    tiledBuffer.transferFromTiledMapData(this._tiledMapData, x1 - offsetX1, y1 - offsetY1, sizeWithPatch.width + offsetX2 , sizeWithPatch.height + offsetY2, 0, 0)

    paints.forEach(paint => {
      const x = paint.x - x1 + offsetX1
      const y = paint.y - y1 + offsetY1
      tiledBuffer.put(this.temporaryChip, x, y)
    })

    for(let y = offsetY1; y < size.height + offsetY2; y++) {
      for(let x = offsetX1; x < size.width + offsetX2; x++) {
        const cursor = tiledBuffer.getMapDataFromChipPosition(x, y)
        const targetChip = tiledBuffer.getMapDataFromChipPosition(x, y)
        const isTemporaryChip = (targetChip instanceof MapChip) ? this.temporaryChip.compare(targetChip) : false
        if (!cursor) continue
        if (!isTemporaryChip) continue

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

        const aroundChips = [
          tiledBuffer.getMapDataFromChipPosition(x, y - 1),
          tiledBuffer.getMapDataFromChipPosition(x - 1, y),
          tiledBuffer.getMapDataFromChipPosition(x + 1, y),
          tiledBuffer.getMapDataFromChipPosition(x, y + 1),
          tiledBuffer.getMapDataFromChipPosition(x - 1, y - 1),
          tiledBuffer.getMapDataFromChipPosition(x + 1, y - 1),
          tiledBuffer.getMapDataFromChipPosition(x - 1, y + 1),
          tiledBuffer.getMapDataFromChipPosition(x + 1, y + 1)
        ]

        if (!aroundChips[0]?.boundary.bottom) adjacent += this._isAdjacent(aroundChips[0]) ? 1 : 0
        if (!aroundChips[1]?.boundary.right) adjacent += this._isAdjacent(aroundChips[1]) ? 2 : 0
        if (!aroundChips[2]?.boundary.left) adjacent += this._isAdjacent(aroundChips[2]) ? 4 : 0
        if (!aroundChips[3]?.boundary.top) adjacent += this._isAdjacent(aroundChips[3]) ? 8 : 0
        if (!aroundChips[4]?.boundary.bottom && !aroundChips[4]?.boundary.right && !aroundChips[4]?.cross.bottomRight) adjacent += this._isAdjacent(aroundChips[4]) ? 16 : 0
        if (!aroundChips[5]?.boundary.bottom && !aroundChips[5]?.boundary.left && !aroundChips[5]?.cross.bottomLeft) adjacent += this._isAdjacent(aroundChips[5]) ? 32 : 0
        if (!aroundChips[6]?.boundary.top && !aroundChips[6]?.boundary.right && !aroundChips[6]?.cross.topRight) adjacent += this._isAdjacent(aroundChips[6]) ? 64 : 0
        if (!aroundChips[7]?.boundary.top && !aroundChips[7]?.boundary.left && !aroundChips[7]?.cross.topLeft) adjacent += this._isAdjacent(aroundChips[7]) ? 128 : 0

        const chip = this.getTiledPattern(adjacent, aroundChips)
        if (chip) {
          tiledBuffer.put(chip, x, y)
          result.push({x: x + x1 - offsetX1, y: y + y1 - offsetY1, chip})
        }
      }
    }

    return result
  }

  private getTiledPattern(adjacent: number, aroundChips: Array<MapChip | MultiMapChip | null>): MultiMapChip | null {
    const multiMapChip = new MultiMapChip()

    const boundary = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }

    const cross = {
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false
    }

    if ((adjacent & 19) === 19 && !aroundChips[0]?.cross.bottomLeft && !aroundChips[1]?.cross.topRight) {
      /* Square */
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 1}))
      boundary.top = false
      boundary.left = false
    } else if ((adjacent & 19) === 2) {
      /* Straight(sideways) */
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 1}))
      boundary.top = true
      boundary.left = false
    } else if ((adjacent & 19) === 1) {
      /* Straight(lengthwise) */
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 1}))
      boundary.top = false
      boundary.left = true
    } else if ((adjacent & 19) === 0) {
      /* Corner */
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 1}))
      boundary.top =  true
      boundary.left = true
    } else if ((adjacent & 19) === 3) {
      /* Cross */
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 1}))
      boundary.top = false
      boundary.left = false
      cross.topLeft = true
    }

    if ((adjacent & 37) === 37 && !aroundChips[0]?.cross.bottomRight && !aroundChips[2]?.cross.topLeft) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 5) === 4) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 5) === 1) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 5) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 2}))
    } else if ((adjacent & 37) === 5) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 2}))
      cross.topRight = true
    }

    if ((adjacent & 74) === 74 && !aroundChips[1]?.cross.bottomRight && !aroundChips[3]?.cross.topRight) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 10) === 2) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 10) === 8) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 10) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 4}))
    } else if ((adjacent & 74) === 10) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 4}))
      cross.bottomLeft = true
    }

    if ((adjacent & 140) === 140 && !aroundChips[2]?.cross.bottomLeft && !aroundChips[3]?.cross.topRight) {
      multiMapChip.push(this._mapChips[4].clone().withParameter({renderingArea: 8}))
      boundary.bottom = false
      boundary.right = false
    } else if ((adjacent & 12) === 4) {
      multiMapChip.push(this._mapChips[2].clone().withParameter({renderingArea: 8}))
      boundary.bottom = true
      boundary.right = false
    } else if ((adjacent & 12) === 8) {
      multiMapChip.push(this._mapChips[1].clone().withParameter({renderingArea: 8}))
      boundary.bottom = false
      boundary.right = true
    } else if ((adjacent & 12) === 0) {
      multiMapChip.push(this._mapChips[0].clone().withParameter({renderingArea: 8}))
      boundary.bottom = true
      boundary.right = true
    } else if ((adjacent & 140) === 12) {
      multiMapChip.push(this._mapChips[3].clone().withParameter({renderingArea: 8}))
      boundary.bottom = false
      boundary.right = false
      cross.bottomRight = true
    }

    if (multiMapChip.length !== 4) return null

    multiMapChip.setBoundary(boundary)
    multiMapChip.setCross(cross)

    return multiMapChip
  }

  private _isAdjacent(chip: MapChip | MultiMapChip | null): boolean {
    const isTemporaryChip = (chip instanceof MapChip) ? this.temporaryChip.compare(chip) : false
    const isAutoTileChip = this._isAutoTileChip(chip)

    return isAutoTileChip || isTemporaryChip
  }

  private _isAutoTileChip(chip: MapChip | MultiMapChip | null): boolean {
    if (!chip) return false

    if (chip instanceof MultiMapChip) {
      return this._mapChips.some(autoTileChip => autoTileChip.compare(chip.items[0]) || this.temporaryChip.compare(chip.items[0]))
    } else {
      return this._mapChips.some(autoTileChip => autoTileChip.compare(chip) || this.temporaryChip.compare(chip))
    }
  }
}
