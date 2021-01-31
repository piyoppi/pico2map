import { Pen } from './../../src/Brushes/Pen'

describe('#mouseMove', () => {
  it('Return a empty list when mouseDown is not called', () => {
    const pen = new Pen()

    expect(pen.mouseMove(0, 0)).toEqual([])
  })

  it('Return a BrushPaint list', () => {
    const pen = new Pen()

    pen.mouseDown(0, 0)
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0}])
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0}, {x: 1, y: 0}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0}, {x: 1, y: 0}])
    expect(pen.mouseMove(1, 1)).toEqual([{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}])
  });
});

