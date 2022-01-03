import { isReadonly, readonly } from '../reactive'

describe("", () => {
  it("happy path", () => {
    /**
     * 只读属性
     */
    const original = { foo: 1, bar: { a: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)


    expect(isReadonly(wrapped)).toBe(true)

  })

  //当改变属性 触发set时发出警告
  it('warn', () => {

    console.warn = jest.fn();

    const user = readonly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})