import { MapMatrix } from './../../src/MapData/MapMatrix'

describe('resize', () => {
  it('Should matrix is expanded', () => {
    const source = [
      1, 1, 2, 1, 1,
      1, 2, 2, 2, 1,
      2, 2, 1, 2, 2,
      1, 2, 2, 2, 1,
      1, 1, 2, 1, 1
    ]
    const matrix = new MapMatrix<number>(5, 5, source)

    matrix.resize(6, 7, 0)

    expect(matrix.width).toEqual(6)
    expect(matrix.height).toEqual(7)
    expect(matrix.size).toEqual(42)

    expect(matrix.items).toEqual([
      1, 1, 2, 1, 1, 0,
      1, 2, 2, 2, 1, 0,
      2, 2, 1, 2, 2, 0,
      1, 2, 2, 2, 1, 0,
      1, 1, 2, 1, 1, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0
    ])
  })

  it('Should matrix is reduced', () => {
    const source = [
      1, 1, 2, 1, 1,
      1, 2, 2, 2, 1,
      2, 2, 1, 2, 2,
      1, 2, 2, 2, 1,
      1, 1, 2, 1, 1
    ]
    const matrix = new MapMatrix<number>(5, 5, source)

    matrix.resize(3, 2, 0)

    expect(matrix.width).toEqual(3)
    expect(matrix.height).toEqual(2)
    expect(matrix.size).toEqual(6)

    expect(matrix.items).toEqual([
      1, 1, 2,
      1, 2, 2
    ])
  })
})

describe('#transferFromTiledMapData', () => {
  it('Transfered a source data', () => {
    const srcMatrix = new MapMatrix<number>(5, 5)
    const expectData = [
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      1, 1, 0, 1, 1,
      0, 1, 1, 1, 0,
      0, 0, 1, 0, 0
    ]

    srcMatrix.set(expectData)

    const destMatrix = new MapMatrix<number | null>(5, 5)

    destMatrix.transferFromTiledMapData(srcMatrix, 0, 0, 5, 5, 0, 0)

    expect(destMatrix.items).toEqual(expectData)
  })

  it('With clipping', () => {
    const source = [
      1, 1, 2, 1, 1,
      1, 2, 2, 2, 1,
      2, 2, 1, 2, 2,
      1, 2, 2, 2, 1,
      1, 1, 2, 1, 1
    ]
    const srcMatrix = new MapMatrix<number>(5, 5, source)
    const destMatrix = new MapMatrix<number | null>(5, 5)

    destMatrix.transferFromTiledMapData(srcMatrix, 1, 1, 3, 3, 2, 1)
    expect(destMatrix.items).toEqual([
      null, null, null, null, null,
      null, null,    2,    2,    2,
      null, null,    2,    1,    2,
      null, null,    2,    2,    2,
      null, null, null, null, null,
    ])

    const destMatrix2 = new MapMatrix<number | null>(5, 5)
    destMatrix2.transferFromTiledMapData(srcMatrix, 1, 1, 3, 4, 3, 4)
    expect(destMatrix2.items).toEqual([
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null,    2,    2,
    ])

    const destMatrix3 = new MapMatrix<number | null>(5, 5)
    destMatrix3.transferFromTiledMapData(srcMatrix, 1, 1, 3, 3, -1, -1)
    expect(destMatrix3.items).toEqual([
         1,    2, null, null, null,
         2,    2, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null,
    ])
  })
})

describe('#put', () => {
  it('Put some MapChips', () => {
    const data = new MapMatrix<number | null>(3, 3)

    data.put(1, 0, 0)
    data.put(2, 1, 1)
    data.put(1, 2, 2)
    data.put(2, 0, 1)
    data.put(1, 0, 2)
    data.put(2, 2, 0)
    data.put(1, 2, 1)
    expect(data.items).toEqual([
      1, null,  2,
      2,    2,  1,
      1, null,  1,
    ])
  })
})

describe('#getFromChipPosition', () => {
  it('return a MapChip', () => {
    const data = new MapMatrix<number>(3, 3)
    const source = [
      1, 0, 2,
      2, 2, 1,
      1, 0, 1,
    ]
    data.set(source)

    expect(data.getFromChipPosition(0, 0)).toEqual(1)
    expect(data.getFromChipPosition(1, 0)).toEqual(0)
    expect(data.getFromChipPosition(1, 1)).toEqual(2)
    expect(data.getFromChipPosition(1, 2)).toEqual(0)
  })
})
