function createMockedCanvasContext() {
  return {
    clearRect: jest.fn()
  }
}

export function createMockedCanvas() {
  return {
    getContext: jest.fn().mockReturnValueOnce(createMockedCanvasContext()),
  }
}
