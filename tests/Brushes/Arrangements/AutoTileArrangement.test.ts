import { TiledMapData } from '../../../src/TiledMap'
import { MapChip } from '../../../src/MapChip'
import { AutoTileArrangement } from './../../../src/Brushes/Arrangements/AutoTileArrangement'

describe('#apply', () => {
  it('Return BrushPaint list', () => {
    const tiledMapData = new TiledMapData(5, 5)
    const autoTiledMapChips = [
      new MapChip(0, 0, 2),
      new MapChip(0, 1, 2),
      new MapChip(0, 2, 2),
      new MapChip(0, 3, 2),
      new MapChip(0, 4, 2)
    ]

    const arranagement = new AutoTileArrangement()
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setMapChips(autoTiledMapChips)

    expect(arranagement.apply([
      {x: 0, y: 0}
    ])).toEqual([
      {x: 0, y: 0, chip: autoTiledMapChips[0]}
    ])
  })
})
