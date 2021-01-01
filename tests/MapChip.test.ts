import { MapChip } from './../src/MapChip'

describe('#compare', () => {
  it('Return true when chip is equal', () => {
    const c1 = new MapChip(0, 0, 0)
    const c2 = new MapChip(0, 0, 0)

    expect(c1.compare(c2)).toEqual(true)
  });

  it('Return false when chip is not equal', () => {
    const c1 = new MapChip(0, 0, 0)
    const c2 = new MapChip(1, 0, 0)

    expect(c1.compare(c2)).toEqual(false)
  });
});
