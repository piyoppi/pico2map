import { MapChip, MultiMapChip } from './../src/MapChip'

describe('#compare', () => {
  it('Return true when chips is equal', () => {
    const c1 = new MapChip(0, 0, 0)
    const c2 = new MapChip(0, 0, 0)
    const c3 = new MapChip(0, 0, 0)
    const c4 = new MapChip(0, 0, 0)
    const multiMapChip1 = new MultiMapChip([c1, c2])
    const multiMapChip2 = new MultiMapChip([c3, c4])

    expect(multiMapChip1.compare(multiMapChip2)).toEqual(true)
  });

  it('Return false when chip is not equal', () => {
    const c1 = new MapChip(0, 0, 0)
    const c2 = new MapChip(0, 0, 0)
    const c3 = new MapChip(1, 0, 0)
    const c4 = new MapChip(0, 0, 0)
    const multiMapChip1 = new MultiMapChip([c1, c2])
    const multiMapChip2 = new MultiMapChip([c3, c4])

    expect(multiMapChip1.compare(multiMapChip2)).toEqual(false)
  });
});
