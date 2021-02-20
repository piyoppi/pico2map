import { AutoTileArrangement } from './../../../src/Brushes/Arrangements/AutoTileArrangement'
import { AutoTile, TiledMapData, MapChip, MapChipFragment, AutoTileMapChip } from '@pico2map/tiled-map'

const tiledMapData = new TiledMapData(3, 3)
const chipId = 2
const autoTileId = 1
const autoTile = new AutoTile([
  new MapChipFragment(0, 0, chipId),
  new MapChipFragment(0, 1, chipId),
  new MapChipFragment(0, 2, chipId),
  new MapChipFragment(0, 3, chipId),
  new MapChipFragment(0, 4, chipId)
], 1)

describe('#apply', () => {
  it('Return a isolated chip when the length of inputted BrushPaints is 1', () => {
    const arranagement = new AutoTileArrangement()
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setAutoTile(autoTile)

    const expectedChip = new AutoTileMapChip(
      autoTileId,
      [
        new MapChipFragment(0, 0, chipId, 1),
        new MapChipFragment(0, 0, chipId, 2),
        new MapChipFragment(0, 0, chipId, 4),
        new MapChipFragment(0, 0, chipId, 8)
      ],
      'AutoTileArrangement',
      {top: true, left: true, bottom: true, right: true}
    )

    expect(arranagement.apply([
      {x: 0, y: 0}
    ])).toEqual([
      {x: 0, y: 0, item: expectedChip}
    ])
  })

  it('Return some chips to link to the road (pattern 1)', () => {
    const arranagement = new AutoTileArrangement()

    /**
     *  Initial tiledMapData
     *  *---*---*---*
     *  | A |   |   |
     *  *---*---*---*
     *  | B |   |   |
     *  *---*---*---*
     *  | C |   |   |
     *  *---*---*---*
     *  A: End of a street
     *  B: Road (lengthwise)
     *  C: End of a street
     */
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 0, chipId, 1),
          new MapChipFragment(0, 0, chipId, 2),
          new MapChipFragment(0, 1, chipId, 4),
          new MapChipFragment(0, 1, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: false, left: true, right: true}
      ),
      0,
      0
    )
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 1, chipId, 1),
          new MapChipFragment(0, 1, chipId, 2),
          new MapChipFragment(0, 1, chipId, 4),
          new MapChipFragment(0, 1, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: false, bottom: false, left: true, right: true}
      ),
      0,
      1
    )
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 1, chipId, 1),
          new MapChipFragment(0, 1, chipId, 2),
          new MapChipFragment(0, 0, chipId, 4),
          new MapChipFragment(0, 0, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: false, bottom: true, left: true, right: true}
      ),
      0,
      2
    )
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setAutoTile(autoTile)

    /**
     *  Expected tiledMapData
     *  *---*---*---*
     *  | A |   |   |
     *  *---*---*---*
     *  | D | E | F |
     *  *---*---*---*
     *  | C |   |   |
     *  *---*---*---*
     *  A: End of a street
     *  C: End of a street
     *  D: T Junction
     *  E: Road (sideways)
     *  F: End of a street
     *
     *  expectedChips is [D, E, F]
     */
    const expectedChips = [
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 1, chipId, 1),
          new MapChipFragment(0, 3, chipId, 2),
          new MapChipFragment(0, 1, chipId, 4),
          new MapChipFragment(0, 3, chipId, 8),
        ],
        'AutoTileArrangement',
        {top: false, bottom: false, left: true, right: false},
        {topLeft: false, topRight: true, bottomLeft: false, bottomRight: true}
      ),
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 2, chipId, 1),
          new MapChipFragment(0, 2, chipId, 2),
          new MapChipFragment(0, 2, chipId, 4),
          new MapChipFragment(0, 2, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: true, left: false, right: false}
      ),
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 2, chipId, 1),
          new MapChipFragment(0, 0, chipId, 2),
          new MapChipFragment(0, 2, chipId, 4),
          new MapChipFragment(0, 0, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: true, left: false, right: true}
      )
    ]

    expect(arranagement.apply([
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1}
    ])).toEqual([
      {x: 0, y: 1, item: expectedChips[0]},
      {x: 1, y: 1, item: expectedChips[1]},
      {x: 2, y: 1, item: expectedChips[2]},
    ])
  })

  it('Return some chips to link to the road (pattern 2)', () => {
    const arranagement = new AutoTileArrangement()

    /**
     *  Initial tiledMapData
     *  *---*---*---*
     *  |   |   |   |
     *  *---*---*---*
     *  | G | E | F |
     *  *---*---*---*
     *  |   |   |   |
     *  *---*---*---*
     *  E: Road (sideways)
     *  F: End of a street
     *  G: End of a street
     */
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 0, chipId, 1),
          new MapChipFragment(0, 2, chipId, 2),
          new MapChipFragment(0, 0, chipId, 4),
          new MapChipFragment(0, 2, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: true, left: true, right: false}
      ),
      0,
      1
    )
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 2, chipId, 1),
          new MapChipFragment(0, 2, chipId, 2),
          new MapChipFragment(0, 2, chipId, 4),
          new MapChipFragment(0, 2, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: true, left: false, right: false}
      ),
      1,
      1
    )
    tiledMapData.put(
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 2, chipId, 1),
          new MapChipFragment(0, 0, chipId, 2),
          new MapChipFragment(0, 2, chipId, 4),
          new MapChipFragment(0, 0, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: true, left: false, right: true}
      ),
      2,
      1
    )
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setAutoTile(autoTile)

    /**
     *  Expected tiledMapData
     *  *---*---*---*
     *  | A |   |   |
     *  *---*---*---*
     *  | D | E | F |
     *  *---*---*---*
     *  | C |   |   |
     *  *---*---*---*
     *  A: End of a street
     *  C: End of a street
     *  D: T Junction
     *  E: Road (sideways)
     *  F: End of a street
     *
     *  expectedChips is [A, D, C]
     */
    const expectedChips = [
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 0, chipId, 1),
          new MapChipFragment(0, 0, chipId, 2),
          new MapChipFragment(0, 1, chipId, 4),
          new MapChipFragment(0, 1, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: true, bottom: false, left: true, right: true}
      ),
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 1, chipId, 1),
          new MapChipFragment(0, 3, chipId, 2),
          new MapChipFragment(0, 1, chipId, 4),
          new MapChipFragment(0, 3, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: false, bottom: false, left: true, right: false},
        {topLeft: false, topRight: true, bottomLeft: false, bottomRight: true}
      ),
      new AutoTileMapChip(
        autoTileId,
        [
          new MapChipFragment(0, 1, chipId, 1),
          new MapChipFragment(0, 1, chipId, 2),
          new MapChipFragment(0, 0, chipId, 4),
          new MapChipFragment(0, 0, chipId, 8)
        ],
        'AutoTileArrangement',
        {top: false, bottom: true, left: true, right: true}
      )
    ]

    expect(arranagement.apply([
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2}
    ])).toEqual([
      {x: 0, y: 0, item: expectedChips[0]},
      {x: 0, y: 1, item: expectedChips[1]},
      {x: 0, y: 2, item: expectedChips[2]},
    ])
  })
})
