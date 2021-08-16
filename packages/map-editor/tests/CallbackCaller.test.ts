import { CallbackCaller } from '../src/CallbackCaller'

test('Should call a registered process', () => {
  const caller = new CallbackCaller()
  const callbackFn = jest.fn()

  caller.add(callbackFn)
  caller.call()

  expect(callbackFn).toBeCalledTimes(1)

  const callbackFn2 = jest.fn()
  caller.add(callbackFn2)
  caller.call()

  expect(callbackFn).toBeCalledTimes(2)
  expect(callbackFn2).toBeCalledTimes(1)
})

test('Should increase the number of Ids of registered items', () => {
  const caller = new CallbackCaller()

  expect(caller.add(() => {}).id).toEqual(1)
  expect(caller.add(() => {}).id).toEqual(2)
  expect(caller.add(() => {}).id).toEqual(3)
})

test('Should remove a specified item', () => {
  const caller = new CallbackCaller()

  const callbackFn = jest.fn()
  const callbackItem = caller.add(callbackFn)

  expect(caller.has(callbackItem)).toEqual(true)

  caller.remove(callbackItem)

  expect(caller.has(callbackItem)).toEqual(false)
})
