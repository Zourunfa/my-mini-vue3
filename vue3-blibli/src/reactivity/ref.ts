import { isObject } from '../utils'
import { effect, isTracking, track, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private dep: any
  private _rawValue: any
  constructor(value) {
    this._rawValue = value
    this._value = getTrueValue(value)
    this.dep = new Set()
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep)
    }
    return this._value
  }

  set value(newValue) {
    if (!Object.is(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = getTrueValue(newValue)
      triggerEffects(this.dep)
    }
  }
}

function getTrueValue(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value) {
  return new RefImpl(value)
}