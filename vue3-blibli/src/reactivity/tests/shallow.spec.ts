import { isReadonly, shallowReadonly } from '../reactive';


describe("shallowReadonly", () => {
  it("no recursion", () => {
    // reactive值作用于对象的表层
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })



  it('warn', () => {

    console.warn = jest.fn();

    const user = shallowReadonly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})



