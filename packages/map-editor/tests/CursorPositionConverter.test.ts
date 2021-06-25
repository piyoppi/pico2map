import { convertFromCursorPositionToChipPosition } from './../src/CursorPositionConverter'

describe('convertFromCursorPositionToChipPosition', () => {
  it('Should return chip-position', () => {
    expect(convertFromCursorPositionToChipPosition(-10, -10, 10, 10, 5, 5)).toEqual({x: 0, y: 0})
    expect(convertFromCursorPositionToChipPosition(0, 0, 10, 10, 5, 5)).toEqual({x: 0, y: 0})
    expect(convertFromCursorPositionToChipPosition(0, 10, 10, 10, 5, 5)).toEqual({x: 0, y: 1})
    expect(convertFromCursorPositionToChipPosition(10, 0, 10, 10, 5, 5)).toEqual({x: 1, y: 0})
    expect(convertFromCursorPositionToChipPosition(50, 30, 10, 10, 5, 5)).toEqual({x: 4, y: 3})
    expect(convertFromCursorPositionToChipPosition(100, 100, 10, 10, 5, 5)).toEqual({x: 4, y: 4})
  })
})
