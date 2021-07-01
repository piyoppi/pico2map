export class Injector {
  inject(calledObject: any, method: (... _: any) => any, before: (() => void) | null, after: (() => void) | null) {
    const original = calledObject[method.name]

    calledObject[method.name] = (...args: Array<any>) => {
      if (before) before()
      const result = original.apply(calledObject, args)
      if (after) after()
      return result
    }
  }
}
