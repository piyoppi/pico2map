export class DummyImage {
  protected _onload = () => {}
  protected _onerror = () => {}
  protected _src = ''

  constructor(_width?: number, _height?: number) {}

  set src(value: string) {
    this._src = value
    this._onload()
  }
  get src() { return this._src }
  set onload(value: () => void) { this._onload = value }
  set onerror(value: () => void) { this._onerror = value }

  get width() { return 100 }
  get height() { return 128 }
}
