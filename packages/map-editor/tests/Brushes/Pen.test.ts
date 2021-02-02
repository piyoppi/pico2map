import { MapChip, MapChipFragment } from '@piyoppi/tiled-map';
import { Pen } from './../../src/Brushes/Pen'
import { DefaultArrangement } from './../../src/Brushes/Arrangements/DefaultArrangement'

describe('#mouseMove', () => {
  it('Return a empty list when mouseDown is not called', () => {
    const pen = new Pen()

    expect(pen.mouseMove(0, 0)).toEqual([])
  })

  it('Return a BrushPaint list', () => {
    const pen = new Pen()
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const expectedMapChip = new MapChip([mapChipFragment])
    const expectedBrushPaintTemplate = {chip: expectedMapChip}
    const arrangement = new DefaultArrangement()
    arrangement.setMapChips([mapChipFragment])
    pen.setArrangement(arrangement)

    pen.mouseDown(0, 0)
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 1)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 1, ...expectedBrushPaintTemplate}])
  });
});

