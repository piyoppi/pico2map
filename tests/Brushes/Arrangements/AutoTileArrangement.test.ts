import { TiledMapData } from '../../../src/TiledMap'
import { MapChip, MultiMapChip } from '../../../src/MapChip'
import { AutoTileArrangement } from './../../../src/Brushes/Arrangements/AutoTileArrangement'

const tiledMapData = new TiledMapData(3, 3)
const chipId = 2
const autoTiledMapChips = [
  new MapChip(0, 0, chipId),
  new MapChip(0, 1, chipId),
  new MapChip(0, 2, chipId),
  new MapChip(0, 3, chipId),
  new MapChip(0, 4, chipId)
]

describe('#apply', () => {
  it('Return a isolated chip when the length of inputted BrushPaints is 1', () => {
    const arranagement = new AutoTileArrangement()
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setMapChips(autoTiledMapChips)

    const expectedChip = new MultiMapChip([
      new MapChip(0, 0, chipId, 1),
      new MapChip(0, 0, chipId, 2),
      new MapChip(0, 0, chipId, 4),
      new MapChip(0, 0, chipId, 8)
    ])
    expectedChip.setBoundary({top: true, left: true, bottom: true, right: true})

    expect(arranagement.apply([
      {x: 0, y: 0}
    ])).toEqual([
      {x: 0, y: 0, chip: expectedChip}
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
      new MultiMapChip(
        [
          new MapChip(0, 0, chipId, 1),
          new MapChip(0, 0, chipId, 2),
          new MapChip(0, 1, chipId, 4),
          new MapChip(0, 1, chipId, 8)
        ],
        {top: true, bottom: false, left: true, right: true}
      ),
      0,
      0
    )
    tiledMapData.put(
      new MultiMapChip(
        [
          new MapChip(0, 1, chipId, 1),
          new MapChip(0, 1, chipId, 2),
          new MapChip(0, 1, chipId, 4),
          new MapChip(0, 1, chipId, 8)
        ],
        {top: false, bottom: false, left: true, right: true}
      ),
      0,
      1
    )
    tiledMapData.put(
      new MultiMapChip(
        [
          new MapChip(0, 1, chipId, 1),
          new MapChip(0, 1, chipId, 2),
          new MapChip(0, 0, chipId, 4),
          new MapChip(0, 0, chipId, 8)
        ],
        {top: false, bottom: true, left: true, right: true}
      ),
      0,
      2
    )
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setMapChips(autoTiledMapChips)

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
      new MultiMapChip(
        [
          new MapChip(0, 1, chipId, 1),
          new MapChip(0, 3, chipId, 2),
          new MapChip(0, 1, chipId, 4),
          new MapChip(0, 3, chipId, 8),
        ],
        {top: false, bottom: false, left: true, right: false},
        {topLeft: false, topRight: true, bottomLeft: false, bottomRight: true}
      ),
      new MultiMapChip(
        [
          new MapChip(0, 2, chipId, 1),
          new MapChip(0, 2, chipId, 2),
          new MapChip(0, 2, chipId, 4),
          new MapChip(0, 2, chipId, 8)
        ],
        {top: true, bottom: true, left: false, right: false}
      ),
      new MultiMapChip(
        [
          new MapChip(0, 2, chipId, 1),
          new MapChip(0, 0, chipId, 2),
          new MapChip(0, 2, chipId, 4),
          new MapChip(0, 0, chipId, 8)
        ],
        {top: true, bottom: true, left: false, right: true}
      )
    ]

    expect(arranagement.apply([
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 1}
    ])).toEqual([
      {x: 0, y: 1, chip: expectedChips[0]},
      {x: 1, y: 1, chip: expectedChips[1]},
      {x: 2, y: 1, chip: expectedChips[2]},
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
      new MultiMapChip(
        [
          new MapChip(0, 0, chipId, 1),
          new MapChip(0, 2, chipId, 2),
          new MapChip(0, 0, chipId, 4),
          new MapChip(0, 2, chipId, 8)
        ],
        {top: true, bottom: true, left: true, right: false}
      ),
      0,
      1
    )
    tiledMapData.put(
      new MultiMapChip(
        [
          new MapChip(0, 2, chipId, 1),
          new MapChip(0, 2, chipId, 2),
          new MapChip(0, 2, chipId, 4),
          new MapChip(0, 2, chipId, 8)
        ],
        {top: true, bottom: true, left: false, right: false}
      ),
      1,
      1
    )
    tiledMapData.put(
      new MultiMapChip(
        [
          new MapChip(0, 2, chipId, 1),
          new MapChip(0, 0, chipId, 2),
          new MapChip(0, 2, chipId, 4),
          new MapChip(0, 0, chipId, 8)
        ],
        {top: true, bottom: true, left: false, right: true}
      ),
      2,
      1
    )
    arranagement.setTiledMapData(tiledMapData)
    arranagement.setMapChips(autoTiledMapChips)

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
      new MultiMapChip(
        [
          new MapChip(0, 0, chipId, 1),
          new MapChip(0, 0, chipId, 2),
          new MapChip(0, 1, chipId, 4),
          new MapChip(0, 1, chipId, 8)
        ],
        {top: true, bottom: false, left: true, right: true}
      ),
      new MultiMapChip(
        [
          new MapChip(0, 1, chipId, 1),
          new MapChip(0, 3, chipId, 2),
          new MapChip(0, 1, chipId, 4),
          new MapChip(0, 3, chipId, 8)
        ],
        {top: false, bottom: false, left: true, right: false},
        {topLeft: false, topRight: true, bottomLeft: false, bottomRight: true}
      ),
      new MultiMapChip(
        [
          new MapChip(0, 1, chipId, 1),
          new MapChip(0, 1, chipId, 2),
          new MapChip(0, 0, chipId, 4),
          new MapChip(0, 0, chipId, 8)
        ],
        {top: false, bottom: true, left: true, right: true}
      )
    ]

    expect(arranagement.apply([
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2}
    ])).toEqual([
      {x: 0, y: 0, chip: expectedChips[0]},
      {x: 0, y: 1, chip: expectedChips[1]},
      {x: 0, y: 2, chip: expectedChips[2]},
    ])
  })
})
