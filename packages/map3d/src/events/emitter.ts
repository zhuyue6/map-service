import { util } from '../shared'

interface Emitter {
  on(key: string, fn: Fn): void
  emit(key: string): void
  remove(key: string, fn: Fn, clear?: boolean): void
}

export function createEmitter() {
  const eventMap: Map<string, ((...arg: any[]) => void)[] | undefined> = new Map()
  const emitter: Emitter = {
    on(key: string, fn: (...arg: any[]) => void) {
      const fns = eventMap.get(key)
      if (util.isUnDef(fns)) {
        eventMap.set(key, [fn])
        return
      }
      if (!fns!.includes(fn)) {
        eventMap.set(key, [fn])
      }
    },
    emit(key: string, ...arg: any[]) {
      const fns = eventMap.get(key)
      if (util.isDef(fns)) {
        for (const fn of fns!) {
          fn(...arg)
        }
      }
    },
    remove(key: string, fn: Fn, clear=false) {
      if (clear) {
        // 清除该key下所有绑定的事件
        eventMap.delete(key)
        return
      }
      let fns = eventMap.get(key)
      fns = fns?.filter((item)=> fn !== item)
      eventMap.set(key, fns)
    },
  }
  return emitter
}

const globalEmitter = createEmitter()

export default globalEmitter