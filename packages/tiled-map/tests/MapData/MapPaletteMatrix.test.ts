import { MapChip, MapChipFragment } from '../../src/MapChip'
import { MapPaletteMatrix } from './../../src/MapData/MapPaletteMatrix'

const c = [
  new MapChip([new MapChipFragment(0, 0, 0)]),
  new MapChip([new MapChipFragment(1, 0, 0)]),
  new MapChip([new MapChipFragment(2, 0, 0)]),
]

describe('resize', () => {
  it('Should matrix is expanded', () => {
    const source = [
      c[1], c[1], c[2], c[1], c[1],
      c[1], c[2], c[2], c[2], c[1],
      c[2], c[2], c[1], c[2], c[2],
      c[1], c[2], c[2], c[2], c[1],
      c[1], c[1], c[2], c[1], c[1]
    ]
    const matrix = new MapPaletteMatrix(5, 5, source)

    matrix.resize(6, 7, null)

    expect(matrix.width).toEqual(6)
    expect(matrix.height).toEqual(7)
    expect(matrix.size).toEqual(42)

    expect(matrix.items).toEqual([
      c[1], c[1], c[2], c[1], c[1], null,
      c[1], c[2], c[2], c[2], c[1], null,
      c[2], c[2], c[1], c[2], c[2], null,
      c[1], c[2], c[2], c[2], c[1], null,
      c[1], c[1], c[2], c[1], c[1], null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
    ])
  })

  it('Should matrix is reduced', () => {
    const source = [
      c[1], c[1], c[2], c[1], c[1],
      c[1], c[2], c[2], c[2], c[1],
      c[2], c[2], c[1], c[2], c[2],
      c[1], c[2], c[2], c[2], c[1],
      c[1], c[1], c[2], c[1], c[1]
    ]
    const matrix = new MapPaletteMatrix(5, 5, source)

    matrix.resize(3, 2, null)

    expect(matrix.width).toEqual(3)
    expect(matrix.height).toEqual(2)
    expect(matrix.size).toEqual(6)

    expect(matrix.items).toEqual([
      c[1], c[1], c[2],
      c[1], c[2], c[2]
    ])
  })
})

describe('#transferFromTiledMapData', () => {
  it('Transfered a source data', () => {
    const srcMatrix = new MapPaletteMatrix(5, 5)
    const expectData = [
      c[0], c[0], c[1], c[0], c[0],
      c[0], c[1], c[1], c[1], c[0],
      c[1], c[1], c[0], c[1], c[1],
      c[0], c[1], c[1], c[1], c[0],
      c[0], c[0], c[1], c[0], c[0]
    ]

    srcMatrix.set(expectData)

    const destMatrix = new MapPaletteMatrix(5, 5)

    destMatrix.transferFromTiledMapData(srcMatrix, 0, 0, 5, 5, 0, 0)

    expect(destMatrix.items).toEqual(expectData)
  })

  it('With clipping', () => {
    const source = [
      c[1], c[1], c[2], c[1], c[1],
      c[1], c[2], c[2], c[2], c[1],
      c[2], c[2], c[1], c[2], c[2],
      c[1], c[2], c[2], c[2], c[1],
      c[1], c[1], c[2], c[1], c[1]
    ]
    const srcMatrix = new MapPaletteMatrix(5, 5, source)
    const destMatrix = new MapPaletteMatrix(5, 5)

    destMatrix.transferFromTiledMapData(srcMatrix, 1, 1, 3, 3, 2, 1)
    expect(destMatrix.items).toEqual([
      null, null, null, null, null,
      null, null, c[2], c[2], c[2],
      null, null, c[2], c[1], c[2],
      null, null, c[2], c[2], c[2],
      null, null, null, null, null,
    ])

    const destMatrix2 = new MapPaletteMatrix(5, 5)
    destMatrix2.transferFromTiledMapData(srcMatrix, 1, 1, 3, 4, 3, 4)
    expect(destMatrix2.items).toEqual([
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, c[2], c[2],
    ])

    const destMatrix3 = new MapPaletteMatrix(5, 5)
    destMatrix3.transferFromTiledMapData(srcMatrix, 1, 1, 3, 3, -1, -1)
    expect(destMatrix3.items).toEqual([
      c[1], c[2], null, null, null,
      c[2], c[2], null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
    ])
  })
})

describe('#put', () => {
  it('Put some MapChips', () => {
    const data = new MapPaletteMatrix(3, 3)

    data.put(c[1], 0, 0)
    data.put(c[2], 1, 1)
    data.put(c[1], 2, 2)
    data.put(c[2], 0, 1)
    data.put(c[1], 0, 2)
    data.put(c[2], 2, 0)
    data.put(c[1], 2, 1)
    expect(data.items).toEqual([
      c[1], null, c[2],
      c[2], c[2], c[1],
      c[1], null, c[1],
    ])
  })
})

describe('#getFromChipPosition', () => {
  it('return a MapChip', () => {
    const data = new MapPaletteMatrix(3, 3)
    const source = [
      c[1], c[0], c[2],
      c[2], c[2], c[1],
      c[1], c[0], c[1],
    ]
    data.set(source)

    expect(data.getFromChipPosition(0, 0)).toEqual(c[1])
    expect(data.getFromChipPosition(1, 0)).toEqual(c[0])
    expect(data.getFromChipPosition(1, 1)).toEqual(c[2])
    expect(data.getFromChipPosition(1, 2)).toEqual(c[0])
  })
})
