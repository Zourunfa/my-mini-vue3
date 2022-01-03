import { reactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'


export const enum reactiveFalgs {
  IS_READONLY = '__isReadony',
  IS_REACTIVE = '__isReactive'
}



export function reactive(raw) {
  return new Proxy(raw, reactiveHandlers)
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers)
}


export function shallowReadonly(raw) {
  return new Proxy(raw, shallowReadonlyHandlers)
}


export function isReadonly(obj) {
  return !!obj[reactiveFalgs.IS_READONLY]
}


export function isReactive(obj) {
  return !!obj[reactiveFalgs.IS_REACTIVE]
}

export function isProxy(obj) {
  return isReactive(obj) || isReadonly(obj)
}