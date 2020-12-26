export class CursorPositionCalculator {
  private _element: HTMLElement | null = null

  public setElement(element: HTMLElement) {
    this._element = element
  }

  getMouseCursorPosition(pageX: number, pageY: number) {
    if (!this._element) return {x: 0, y: 0}

    const rect = this._element.getBoundingClientRect()

    return {
      x: (pageX - window.scrollX - rect.x),
      y: (pageY - window.scrollY - rect.y)
    }
  }
}
