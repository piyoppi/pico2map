import { MapChip, MapChipFragment } from './../src/MapChip'

describe('#compare', () => {
  it('Return true when chips is equal', () => {
    const c1 = new MapChipFragment(0, 0, 0)
    const c2 = new MapChipFragment(0, 0, 0)
    const c3 = new MapChipFragment(0, 0, 0)
    const c4 = new MapChipFragment(0, 0, 0)
    const mapChip1 = new MapChip([c1, c2])
    const mapChip2 = new MapChip([c3, c4])

    expect(mapChip1.compare(mapChip2)).toEqual(true)
  });

  it('Return false when chip is not equal', () => {
    const c1 = new MapChipFragment(0, 0, 0)
    const c2 = new MapChipFragment(0, 0, 0)
    const c3 = new MapChipFragment(1, 0, 0)
    const c4 = new MapChipFragment(0, 0, 0)
    const mapChip1 = new MapChip([c1, c2])
    const mapChip2 = new MapChip([c3, c4])

    expect(mapChip1.compare(mapChip2)).toEqual(false)
  });
});
