import { RectangleBrush } from './../../src/Brushes/RectangleBrush'

describe('#mouseMove', () => {
  it('Return a empty list when mouseDown is not called', () => {
    const brush = new RectangleBrush()

    expect(brush.mouseMove(0, 0)).toEqual([])
  })

  it('Return a BrushPaint list', () => {
    const brush = new RectangleBrush()

    brush.mouseDown(0, 0)

    expect(brush.mouseMove(0, 0)).toEqual([{x: 0, y: 0}])
    expect(brush.mouseMove(0, 0)).toEqual([{x: 0, y: 0}])
    expect(brush.mouseMove(1, 0)).toEqual([{x: 0, y: 0}, {x: 1, y: 0}])
    expect(brush.mouseMove(1, 0)).toEqual([{x: 0, y: 0}, {x: 1, y: 0}])
    expect(brush.mouseMove(1, 1)).toEqual([{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}])
  });
});

describe('#mouseUp', () => {
  it('Return a BrushPaint list', () => {
    const brush = new RectangleBrush()
    brush.mouseDown(0, 0)

    expect(brush.mouseUp(1, 1)).toEqual([{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}])
  })
})
