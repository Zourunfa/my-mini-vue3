let activeEffect
let shouldTrack
class ReactiveEffect {
  fn: any
  private active: Boolean = true
  public scheduler?: Function | undefined
  deps = []
  constructor(fn) {
    this.fn = fn
  }

  run() {

    if (!this.active) {
      return this.fn()
    }
    activeEffect = this
    shouldTrack = true
    let res = this.fn()
    shouldTrack = false

    return res
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }

  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn)
  _effect.scheduler = options.scheduler
  const runner: any = _effect.run.bind(_effect)
  runner._effect = _effect
  _effect.run()
  return runner
}
// target - > depsMap    key ->dep
let targetMap = new Map()

export function track(target, key) {
  if (!isTracking()) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}


export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function triggerEffects(dep) {


  for (let effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }

  }
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function stop(runner) {
  runner._effect.stop()

}