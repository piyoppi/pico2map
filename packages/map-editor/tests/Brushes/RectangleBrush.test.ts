import { MapChip, MapChipFragment, TiledMapDataItem } from '@pico2map/tiled-map';
import { RectangleBrush } from './../../src/Brushes/RectangleBrush'
import { DefaultArrangement } from './../../src/Brushes/Arrangements/DefaultArrangement'

function buildBrush(mapChipFragment: MapChipFragment): RectangleBrush<TiledMapDataItem> {
  const brush = new RectangleBrush<TiledMapDataItem>()
  const arrangement = new DefaultArrangement()
  arrangement.setMapChips([mapChipFragment])
  brush.setArrangement(arrangement)

  return brush
}

describe('#mouseMove', () => {
  it('Return a empty list when mouseDown is not called', () => {
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const brush = buildBrush(mapChipFragment)

    expect(brush.mouseMove(0, 0)).toEqual([])
  })

  it('Return a BrushPaint list', () => {
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const expectedMapChip = new MapChip([mapChipFragment])
    const expectedBrushPaintTemplate = {item: expectedMapChip}
    const brush = buildBrush(mapChipFragment)

    brush.mouseDown(0, 0)

    expect(brush.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(brush.mouseMove(0, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}])
    expect(brush.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(brush.mouseMove(1, 0)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}])
    expect(brush.mouseMove(1, 1)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 0, y: 1, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 1, ...expectedBrushPaintTemplate}])
  });
});

describe('#mouseUp', () => {
  it('Return a BrushPaint list', () => {
    const mapChipFragment = new MapChipFragment(0, 0, 1)
    const expectedMapChip = new MapChip([mapChipFragment])
    const expectedBrushPaintTemplate = {item: expectedMapChip}
    const brush = buildBrush(mapChipFragment)
    brush.mouseDown(0, 0)

    expect(brush.mouseUp(1, 1)).toEqual([{x: 0, y: 0, ...expectedBrushPaintTemplate}, {x: 0, y: 1, ...expectedBrushPaintTemplate}, {x: 1, y: 0, ...expectedBrushPaintTemplate}, {x: 1, y: 1, ...expectedBrushPaintTemplate}])
  })
})
