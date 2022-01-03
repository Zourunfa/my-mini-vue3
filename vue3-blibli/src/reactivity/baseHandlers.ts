import { isObject } from '../utils'
import { track, trigger } from './effect'
import { reactive, reactiveFalgs, readonly } from './reactive'

let get = createGetter()
let set = createSetter()
let readonlyGet = createGetter(true)
let shallowReadonlyGet = createGetter(true, true)

export function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {

    if (key === reactiveFalgs.IS_READONLY) {
      return isReadonly
    }
    if (key === reactiveFalgs.IS_REACTIVE) {
      return !isReadonly
    }
    let res = Reflect.get(target, key)
    // 收集依赖

    if (shallow) {
      return res
    }


    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      track(target, key)
    }


    return res
  }

}

export function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value)
    // 触发更新
    trigger(target, key)
    return res
  }
}


export const reactiveHandlers = {
  get: get,
  set: set
}


export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn('只读属性 不可更改')
    return true
  }
}

export const shallowReadonlyHandlers = Object.assign({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
