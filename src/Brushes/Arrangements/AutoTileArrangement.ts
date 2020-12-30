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
    const tiledBuffer = new TiledMapData(size.width, size.height)

    paints.forEach(paint => {
      tiledBuffer.put(this._mapChips[0], paint.x - x1, paint.y - y1)
    })

    for(let y = 0; y < size.height; y++) {
      for(let x = 0; x < size.width; x++) {
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

        console.log(adjacent)
        result.push({x: x + x1, y: y + y1, chip: this.getTiledPattern(adjacent)})
      }
    }

    return result
  }

  private getTiledPattern(adjacent: number) {
    switch(adjacent) {
      /* Isolated */
      case 0:
        return this._mapChips[0]

      /* End */
      case 1:
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 12}),
          this._mapChips[1].clone().withParameter({renderingArea: 3})
        ])
      case 2:
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 10}),
          this._mapChips[2].clone().withParameter({renderingArea: 5})
        ])
      case 4:
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 5}),
          this._mapChips[2].clone().withParameter({renderingArea: 10})
        ])
      case 8:
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 3}),
          this._mapChips[1].clone().withParameter({renderingArea: 12})
        ])

      /* Curve */
      case 3:   // 1 + 2
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 8}),
          this._mapChips[1].clone().withParameter({renderingArea: 2}),
          this._mapChips[2].clone().withParameter({renderingArea: 4}),
          this._mapChips[3].clone().withParameter({renderingArea: 1})
        ])
      case 5:   // 1 + 4
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 4}),
          this._mapChips[1].clone().withParameter({renderingArea: 1}),
          this._mapChips[2].clone().withParameter({renderingArea: 8}),
          this._mapChips[3].clone().withParameter({renderingArea: 2})
        ])
      case 10:  // 2 + 8
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 4}),
          this._mapChips[1].clone().withParameter({renderingArea: 1}),
          this._mapChips[2].clone().withParameter({renderingArea: 8}),
          this._mapChips[3].clone().withParameter({renderingArea: 2})
        ])
      case 12:  // 4 + 8
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 4}),
          this._mapChips[1].clone().withParameter({renderingArea: 1}),
          this._mapChips[2].clone().withParameter({renderingArea: 8}),
          this._mapChips[3].clone().withParameter({renderingArea: 2})
        ])

      /* Straight */
      case 6:   // 2 + 4
        return this._mapChips[2]

      case 9:   // 1 + 8
        return this._mapChips[1]

      /* T Junction */
      case 7:   // 1 + 2 + 4
      case 11:  // 1 + 2 + 8
      case 13:  // 1 + 4 + 8
      case 14:  // 2 + 4 + 8

      /* Corner */
      case 19:  // 1 + 2 + 16
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 8}),
          this._mapChips[1].clone().withParameter({renderingArea: 2}),
          this._mapChips[2].clone().withParameter({renderingArea: 4}),
          this._mapChips[4].clone().withParameter({renderingArea: 1})
        ])
      case 37:  // 1 + 4 + 32
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 4}),
          this._mapChips[1].clone().withParameter({renderingArea: 1}),
          this._mapChips[2].clone().withParameter({renderingArea: 8}),
          this._mapChips[4].clone().withParameter({renderingArea: 2})
        ])
      case 74:  // 2 + 8 + 64
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 2}),
          this._mapChips[1].clone().withParameter({renderingArea: 8}),
          this._mapChips[2].clone().withParameter({renderingArea: 1}),
          this._mapChips[4].clone().withParameter({renderingArea: 4})
        ])
      case 140: // 4 + 8 + 128
        return new MultiMapChip([
          this._mapChips[0].clone().withParameter({renderingArea: 1}),
          this._mapChips[1].clone().withParameter({renderingArea: 4}),
          this._mapChips[2].clone().withParameter({renderingArea: 2}),
          this._mapChips[4].clone().withParameter({renderingArea: 8})
        ])

      /* Cross */
      case 15:
        return this._mapChips[3]

      /* Square Edge */
      case 55:  // 1 + 2 + 4 + 16 + 32
        return new MultiMapChip([
          this._mapChips[2].clone().withParameter({renderingArea: 12}),
          this._mapChips[4].clone().withParameter({renderingArea: 3})
        ])

      case 206: // 2 + 4 + 8 + 64 + 128
        return new MultiMapChip([
          this._mapChips[2].clone().withParameter({renderingArea: 3}),
          this._mapChips[4].clone().withParameter({renderingArea: 12})
        ])

      case 173: // 1 + 4 + 8 + 32 + 128
        return new MultiMapChip([
          this._mapChips[1].clone().withParameter({renderingArea: 5}),
          this._mapChips[4].clone().withParameter({renderingArea: 10})
        ])

      case 91:  // 1 + 2 + 8 + 16 + 64
        return new MultiMapChip([
          this._mapChips[1].clone().withParameter({renderingArea: 10}),
          this._mapChips[4].clone().withParameter({renderingArea: 5})
        ])

      /* Square */
      default: // usually 1 + 2 + 4 + 8 + 16 + 32 + 64 + 128 = 255
        return this._mapChips[4]
    }
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
