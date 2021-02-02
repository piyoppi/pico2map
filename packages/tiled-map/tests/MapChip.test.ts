import { MapChipFragment } from './../src/MapChip'

describe('#compare', () => {
  it('Return true when chip is equal', () => {
    const c1 = new MapChipFragment(0, 0, 0)
    const c2 = new MapChipFragment(0, 0, 0)

    expect(c1.compare(c2)).toEqual(true)
  });

  it('Return false when chip is not equal', () => {
    const c1 = new MapChipFragment(0, 0, 0)
    const c2 = new MapChipFragment(1, 0, 0)

    expect(c1.compare(c2)).toEqual(false)
  });
});

describe('#clone', () => {
  it('Return cloned item', () => {
    const c1 = new MapChipFragment(0, 0, 0)
    const c2 = c1.clone()

    expect(c1.compare(c2)).toEqual(true)
  })
})

describe('#withParameter', () => {
  it('Should set some parameters', () => {
    const c1 = new MapChipFragment(0, 0, 0)

    c1.withParameter({x: 123, y: 456})
    expect(c1.x).toEqual(123)
    expect(c1.y).toEqual(456)

    c1.withParameter({renderingArea: 3})
    expect(c1.renderingArea).toEqual(3)
  })
})
