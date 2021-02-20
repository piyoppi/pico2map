import { MapChip, MapChipFragment, TiledMapDataItem } from '@pico2map/tiled-map';
import { Pen } from './../../src/Brushes/Pen'
import { DefaultArrangement } from './../../src/Brushes/Arrangements/DefaultArrangement'

function buildBrush(mapChipFragment: MapChipFragment): Pen<TiledMapDataItem> {
  const brush = new Pen<TiledMapDataItem>()
  const arrangement = new DefaultArrangement()
  arrangement.setMapChips([mapChipFragment])
  brush.setArrangement(arrangement)

  return brush
}

describe('#mouseMove', () => {
  it('Return a empty list when mouseDown is not called', () => {
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const pen = buildBrush(mapChipFragment)

    expect(pen.mouseMove(0, 0)).toEqual([])
  })

  it('Return a BrushPaint list', () => {
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const pen = buildBrush(mapChipFragment)
    const expectedMapChip = new MapChip([mapChipFragment])
    const expectedBrushPaintTemplate = {item: expectedMapChip}

    pen.mouseDown(0, 0)
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(pen.mouseMove(1, 1)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 1, ...expectedBrushPaintTemplate}])
  });
});

