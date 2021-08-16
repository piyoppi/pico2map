import { CallbackCallers } from '../src/CallbackCallers'

type CallerKeys = 'TestCaller' | 'TestSubCaller'

test('Should call a registered process', () => {
  const callers = new CallbackCallers<CallerKeys>()
  const callbackFn = jest.fn()

  callers.add('TestCaller', callbackFn)
  callers.call('TestCaller')

  expect(callbackFn).toBeCalledTimes(1)

  const callbackFn2 = jest.fn()
  callers.add('TestCaller', callbackFn2)
  callers.call('TestCaller')

  expect(callbackFn).toBeCalledTimes(2)
  expect(callbackFn2).toBeCalledTimes(1)

  const callbackFn3 = jest.fn()
  callers.add('TestSubCaller', callbackFn3)
  callers.call('TestSubCaller')

  expect(callbackFn).toBeCalledTimes(2)
  expect(callbackFn2).toBeCalledTimes(1)
  expect(callbackFn3).toBeCalledTimes(1)
})

test('Should remove a specified item', () => {
  const callers = new CallbackCallers<CallerKeys>()

  const callbackFn = jest.fn()
  const callbackItem = callers.add('TestCaller', callbackFn)

  expect(callers.has('TestCaller', callbackItem)).toEqual(true)

  callers.remove('TestCaller', callbackItem)

  expect(callers.has('TestCaller', callbackItem)).toEqual(false)
})
