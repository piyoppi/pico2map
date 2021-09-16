import { convertFromCursorPositionToChipPosition, convertChipPositionDivisionByCursorSize } from './../src/CursorPositionConverter'

describe('convertFromCursorPositionToChipPosition', () => {
  it('Should return chip-position', () => {
    expect(convertFromCursorPositionToChipPosition(-10, -10, 10, 10, 5, 5)).toEqual({x: 0, y: 0})
    expect(convertFromCursorPositionToChipPosition(0, 0, 10, 10, 5, 5)).toEqual({x: 0, y: 0})
    expect(convertFromCursorPositionToChipPosition(0, 10, 10, 10, 5, 5)).toEqual({x: 0, y: 1})
    expect(convertFromCursorPositionToChipPosition(10, 0, 10, 10, 5, 5)).toEqual({x: 1, y: 0})
    expect(convertFromCursorPositionToChipPosition(50, 30, 10, 10, 5, 5)).toEqual({x: 4, y: 3})
    expect(convertFromCursorPositionToChipPosition(100, 100, 10, 10, 5, 5)).toEqual({x: 4, y: 4})

    expect(convertFromCursorPositionToChipPosition(14, 24, 10, 10, 10, 10, 3, 2)).toEqual({x: 0, y: 1})
    expect(convertFromCursorPositionToChipPosition(15, 25, 10, 10, 10, 10, 3, 2)).toEqual({x: 1, y: 2})
    expect(convertFromCursorPositionToChipPosition(24, 34, 10, 10, 10, 10, 3, 2)).toEqual({x: 1, y: 2})
    expect(convertFromCursorPositionToChipPosition(25, 35, 10, 10, 10, 10, 3, 2)).toEqual({x: 2, y: 3})
    expect(convertFromCursorPositionToChipPosition(25, 35, 10, 10,  3,  3, 3, 2)).toEqual({x: 0, y: 1})
  })
})

describe('convertChipPositionDivisionByCursorSize', () => {
  it('Should return chip-position', () => {
    expect(convertChipPositionDivisionByCursorSize(3, 2, 1, 2, 3, 2)).toEqual({x: 1, y: 2})
    expect(convertChipPositionDivisionByCursorSize(4, 2, 1, 2, 3, 2)).toEqual({x: 4, y: 2})
    expect(convertChipPositionDivisionByCursorSize(3, 3, 1, 2, 3, 2)).toEqual({x: 1, y: 2})
    expect(convertChipPositionDivisionByCursorSize(3, 4, 1, 2, 3, 2)).toEqual({x: 1, y: 4})
  })
})
