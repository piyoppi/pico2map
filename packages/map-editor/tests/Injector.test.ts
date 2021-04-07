import { Injector } from './../src/Injector'

class DummyClass {
  private _counter: number = 0

  get counter() {
    return this._counter
  }

  count() {
    this._counter++
  }
}

describe('#inject', () => {
  it('Should inject a before/after callback function', () => {
    const injector = new Injector()
    const injected = new DummyClass()

    let beforeFunctionCalled = false
    let afterFunctionCalled = false
    injector.inject(injected, injected.count, () => beforeFunctionCalled = true, () => afterFunctionCalled = true)

    injected.count()

    expect(injected.counter).toEqual(1)
    expect(beforeFunctionCalled).toEqual(true)
    expect(afterFunctionCalled).toEqual(true)
  })
})
