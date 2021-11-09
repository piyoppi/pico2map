import { TiledColisionDetector, TiledColisionDetectable, ColiderTypes } from './../src/TiledColisionDetector'

class DummyColisionMap implements TiledColisionDetectable {
  constructor(private coliderMapArray: Array<Array<ColiderTypes>>) {}

  getFromChipPosition(x: number, y: number): ColiderTypes {
    if (x < 0 || x >= this.coliderMapArray[0].length || y < 0 || y >= this.coliderMapArray.length) {
      throw new Error('The position is out of range.')
    }

    return this.coliderMapArray[y][x]
  }

  get width() {
    return this.coliderMapArray[0].length
  }

  get height() {
    return this.coliderMapArray.length
  }
}

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
  const detector = new TiledColisionDetector(
    new DummyColisionMap([
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
      [0,  1,  1],  //__320
      [0,  1,  1],  //__352
    ]),
    32,
    32
  )
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
    const detector = new TiledColisionDetector(
      new DummyColisionMap([
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
        [0,  1,  1],  //__320
        [0,  1,  1],  //__352
      ]),
      32,
      32
    )
    expect(detector.getOverlapped(items[0])).toEqual({dx: 2, dy: -20, dxMax: 2, dyMax: -20})
    expect(detector.getOverlapped(items[1])).toEqual({dx: -20, dy: 2, dxMax: -20, dyMax: 2})
    expect(detector.getOverlapped(items[2])).toEqual({dx: -2, dy: -20, dxMax: -2, dyMax: -20})
    expect(detector.getOverlapped(items[3])).toEqual({dx: 20, dy: 2, dxMax: 20, dyMax: 2})
    expect(detector.getOverlapped(items[4])).toEqual({dx: 2, dy: 20, dxMax: 2, dyMax: 20})
    expect(detector.getOverlapped(items[5])).toEqual({dx: -20, dy: -2, dxMax: -20, dyMax: -2})
    expect(detector.getOverlapped(items[6])).toEqual({dx: -2, dy: 20, dxMax: -2, dyMax: 20})
    expect(detector.getOverlapped(items[7])).toEqual({dx: 20, dy: -2, dxMax: 20, dyMax: -2})
    expect(detector.getOverlapped(items[8])).toEqual({dx: 4, dy: 2, dxMax: -16, dyMax: -18})
    expect(detector.getOverlapped(items[9])).toEqual({dx: -4, dy: 2, dxMax: 16, dyMax: -18})
    expect(detector.getOverlapped(items[10])).toEqual({dx: 2, dy: -4, dxMax: -18, dyMax: 16})
    expect(detector.getOverlapped(items[11])).toEqual({dx: -4, dy: -2, dxMax: 16, dyMax: 18})
    expect(detector.getOverlapped(items[12])).toEqual({dx: 0, dy: -5, dxMax: 54, dyMax: -5})
    expect(detector.getOverlapped(items[13])).toEqual({dx: 4, dy: 2, dxMax: 4, dyMax: -18})
  })
})

describe('solveOverlapped', () => {
  it('Should return the overlapping amount', () => {
    const detector = new TiledColisionDetector(
      new DummyColisionMap([
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
        [0,  1,  1],  //__320
        [0,  1,  1],  //__352
      ]),
      32,
      32
    )
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

  it('Should not reference outside the colision map', () => {
    const detector = new TiledColisionDetector(
      new DummyColisionMap([
        //|32 |64
        [1,  1],  //__32
        [1,  1],  //__32
      ]),
      32,
      32
    )
    expect(detector.solveOverlapped({x: 31.7, y: 4.8, width: 32, height: 32})).toEqual({dx: expect.anything(), dy: expect.anything()})
  })
})
