import { TiledColisionDetector, TiledColisionDetectable, ColiderTypes } from './../src/TiledColisionDetector'

class DummyColisionMap implements TiledColisionDetectable {
  getFromChipPosition(x: number, y: number): ColiderTypes {
    const coliderMap: Array<Array<ColiderTypes>> = [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 0],
    ]

    return coliderMap[y][x]
  }
}

const colisionMap = new DummyColisionMap()
const chipSize = {width: 32, height: 32}
const detector = new TiledColisionDetector(colisionMap, chipSize.width, chipSize.height)
const items = [
  {x: 30, y: 32, width: 20, height: 20},
  {x: 32, y: 30, width: 20, height: 20},
  {x: 46, y: 32, width: 20, height: 20},
  {x: 44, y: 30, width: 20, height: 20},
  {x: 30, y: 44, width: 20, height: 20},
  {x: 32, y: 46, width: 20, height: 20},
  {x: 46, y: 44, width: 20, height: 20},
  {x: 44, y: 46, width: 20, height: 20},
  {x: 28, y: 30, width: 20, height: 20},
  {x: 48, y: 30, width: 20, height: 20},
  {x: 30, y: 48, width: 20, height: 20},
  {x: 48, y: 46, width: 20, height: 20},
  {x: 10, y: 165, width: 80, height: 20},
]

describe('detect', () => {
  it('Should return colided tile positions', () => {
    expect(detector.detect(items[0])).toEqual([{x: 0, y: 1}])
    expect(detector.detect(items[1])).toEqual([{x: 1, y: 0}])
    expect(detector.detect(items[2])).toEqual([{x: 2, y: 1}])
    expect(detector.detect(items[3])).toEqual([{x: 1, y: 0}])
    expect(detector.detect(items[4])).toEqual([{x: 0, y: 1}])
    expect(detector.detect(items[5])).toEqual([{x: 1, y: 2}])
    expect(detector.detect(items[6])).toEqual([{x: 2, y: 1}])
    expect(detector.detect(items[7])).toEqual([{x: 1, y: 2}])
    expect(detector.detect(items[8])).toEqual([{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}])
    expect(detector.detect(items[9])).toEqual([{x: 1, y: 0}, {x: 2, y: 1}])
    expect(detector.detect(items[10])).toEqual([{x: 0, y: 1}, {x: 1, y: 2}])
    expect(detector.detect(items[11])).toEqual([{x: 2, y: 1}, {x: 1, y: 2}])
    expect(detector.detect(items[12])).toEqual([{x: 1, y: 5}])
  })
})

describe('getOverlapped', () => {
  it('Should return the overlapping amount', () => {
    expect(detector.getOverlapped(items[0])).toEqual({dx: 2, dy: 0})
    expect(detector.getOverlapped(items[1])).toEqual({dx: 0, dy: 2})
    expect(detector.getOverlapped(items[2])).toEqual({dx: -2, dy: 0})
    expect(detector.getOverlapped(items[3])).toEqual({dx: 0, dy: 2})
    expect(detector.getOverlapped(items[4])).toEqual({dx: 2, dy: 0})
    expect(detector.getOverlapped(items[5])).toEqual({dx: 0, dy: -2})
    expect(detector.getOverlapped(items[6])).toEqual({dx: -2, dy: 0})
    expect(detector.getOverlapped(items[7])).toEqual({dx: 0, dy: -2})
    expect(detector.getOverlapped(items[8])).toEqual({dx: 4, dy: 2})
    expect(detector.getOverlapped(items[9])).toEqual({dx: -4, dy: 2})
    expect(detector.getOverlapped(items[10])).toEqual({dx: 2, dy: -4})
    expect(detector.getOverlapped(items[11])).toEqual({dx: -4, dy: -2})
    expect(detector.getOverlapped(items[12])).toEqual({dx: 0, dy: -5})
  })
})
