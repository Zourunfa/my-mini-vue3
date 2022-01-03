import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe("effect", () => {
  it("core", () => {
    const reactiveObj = reactive({ foo: 1 })

    let newFoo

    effect(() => {
      newFoo = reactiveObj.foo + 1
    })
    expect(newFoo).toBe(2)


    // 触发更新
    reactiveObj.foo++
    expect(newFoo).toBe(3)
  })

  it("runner", () => {
    let a = 1

    const runner = effect(() => {
      a++
      return 'a'
    })

    expect(a).toBe(2)
    const r = runner()
    expect(a).toBe(3)
    expect(r).toBe('a')
  })


  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it("stop", () => {
    let dummy;
    const obj = reactive({ props: 1 })

    const runner = effect(() => {
      dummy = obj.prop
    })

    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    /**
     * obj.prop++ =>obj.prop = obj.prop+1
     */
    obj.prop++
    //可以看到没有立即更新为3 因为上面的runner调用了stop方法
    expect(dummy).toBe(2)

    runner()
    expect(dummy).toBe(3)
  })


})