import { TiledColisionDetector, TiledColisionDetectable, ColiderTypes } from './../src/TiledColisionDetector'

class DummyColisionMap implements TiledColisionDetectable {
  getFromChipPosition(x: number, y: number): ColiderTypes {
    const coliderMap: Array<Array<ColiderTypes>> = [
      //|32 |64 |96
      [1,  1,  0],  //__32
      [1,  0,  1],  //__64
      [0,  1,  0],  //__96
      [0,  0,  0],  //__128
      [0,  0,  0],  //__160
      [0,  1,  0],  //__192
      [0,  0,  0],  //__224
      [1,  0,  0],  //__256
      [1,  0,  0],  //__288
      [0,  0,  1],  //__320
      [0,  0,  1],  //__352
    ]

    return coliderMap[y][x]
  }
}

const colisionMap = new DummyColisionMap()
const chipSize = {width: 32, height: 32}
const detector = new TiledColisionDetector(colisionMap, chipSize.width, chipSize.height)
const items = [
  {x: 30, y: 32, width: 20, height: 20},        //  0 : Overlapped: x =  2, y =  0
  {x: 32, y: 30, width: 20, height: 20},        //  1 : Overlapped: x =  0, y =  2
  {x: 46, y: 32, width: 20, height: 20},        //  2 : Overlapped: x = -2, y =  0
  {x: 44, y: 30, width: 20, height: 20},        //  3 : Overlapped: x =  0, y =  2
  {x: 30, y: 44, width: 20, height: 20},        //  4 : Overlapped: x =  2, y =  0
  {x: 32, y: 46, width: 20, height: 20},        //  5 : Overlapped: x =  0, y = -2
  {x: 46, y: 44, width: 20, height: 20},        //  6 : Overlapped: x = -2, y =  0
  {x: 44, y: 46, width: 20, height: 20},        //  7 : Overlapped: x =  0, y = -2
  {x: 28, y: 30, width: 20, height: 20},        //  8 : Overlapped: x =  4, y =  2
  {x: 48, y: 30, width: 20, height: 20},        //  9 : Overlapped: x = -4, y =  2
  {x: 30, y: 48, width: 20, height: 20},        // 10 : Overlapped: x =  2, y = -4
  {x: 48, y: 46, width: 20, height: 20},        // 11 : Overlapped: x = -4, y = -2
  {x: 10, y: 145, width: 80, height: 20},       // 12 : Overlapped: x =  0, y = -5
  {x: 28, y: 254, width: 20, height: 20},       // 13 : Overlapped: x =  4, y =  0
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

describe('solveOverlapped', () => {
  it('Should return the overlapping amount', () => {
    expect(detector.solveOverlapped(items[0])).toEqual({dx: 2, dy: 0})
    expect(detector.solveOverlapped(items[1])).toEqual({dx: 0, dy: 2})
    expect(detector.solveOverlapped(items[2])).toEqual({dx: -2, dy: 0})
    expect(detector.solveOverlapped(items[3])).toEqual({dx: 0, dy: 2})
    expect(detector.solveOverlapped(items[4])).toEqual({dx: 2, dy: 0})
    expect(detector.solveOverlapped(items[5])).toEqual({dx: 0, dy: -2})
    expect(detector.solveOverlapped(items[6])).toEqual({dx: -2, dy: 0})
    expect(detector.solveOverlapped(items[7])).toEqual({dx: 0, dy: -2})
    expect(detector.solveOverlapped(items[8])).toEqual({dx: 4, dy: 2})
    expect(detector.solveOverlapped(items[9])).toEqual({dx: -4, dy: 2})
    expect(detector.solveOverlapped(items[10])).toEqual({dx: 2, dy: -4})
    expect(detector.solveOverlapped(items[11])).toEqual({dx: -4, dy: -2})
    expect(detector.solveOverlapped(items[12])).toEqual({dx: 0, dy: -5})
    expect(detector.solveOverlapped(items[13])).toEqual({dx: 4, dy: 0})
  })
})
