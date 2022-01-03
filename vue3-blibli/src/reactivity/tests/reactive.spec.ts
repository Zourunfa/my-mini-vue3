import { isProxy, isReactive, isReadonly, reactive } from '../reactive'

describe("", () => {
  it("core/reactive", () => {
    const obj = { foo: 1 }
    const reactiveObj = reactive(obj)

    expect(reactiveObj).not.toBe(obj)
    expect(reactiveObj.foo).toBe(1)


    expect(isReactive(reactiveObj)).toBe(true)

    expect(isReactive(obj)).toBe(false)

    expect(isProxy(reactiveObj)).toBe(true)
    expect(isProxy(obj)).toBe(false)
  })

  it("recursion reactives", () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }

    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })



})