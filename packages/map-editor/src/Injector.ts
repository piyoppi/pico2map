export class Injector {
  inject(calledObject: any, method: (... _: any) => any, before: (() => void) | null, after: (() => void) | null) {
    const original = calledObject[method.name]

    calledObject[method.name] = () => {
      if (before) before()
      const result = original.call(calledObject)
      if (after) after()
      return result
    }
  }
}
