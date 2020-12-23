export class CursorPositionCalculator {
  private boundingRect: DOMRect | null = null

  public setElement(element: HTMLElement) {
    this.boundingRect = element.getBoundingClientRect() || null
  }

  getMouseCursorPosition(pageX: number, pageY: number) {
    if (!this.boundingRect) return {x: 0, y: 0}

    return {
      x: (pageX - this.boundingRect.x),
      y: (pageY - this.boundingRect.y)
    }
  }
}
