import { util } from '../shared'
export interface Emitter<T = string> {
  on(key: T, fn: Fn): void
  emit(key: T, ...arg: any[]): void
  remove(key: T, fn: Fn, clear?: boolean): void
}

export function createEmitter<T extends string>(): Emitter<T> {
  const eventMap: Map<string, ((...arg: any[]) => void)[] | undefined> = new Map()
  const emitter: Emitter<T> = {
    on(key: T, fn: (...arg: any[]) => void) {
      const fns = eventMap.get(key)
      if (util.isUnDef(fns)) {
        eventMap.set(key, [fn])
        return
      }
      if (!fns!.includes(fn)) {
        eventMap.set(key, [fn])
      }
    },
    emit(key: T, ...arg: any[]) {
      const fns = eventMap.get(key)
      if (util.isDef(fns)) {
        for (const fn of fns!) {
          fn(...arg)
        }
      }
    },
    remove(key: T, fn: Fn, clear=false) {
      if (clear) {
        // 清除该key下所有绑定的事件
        eventMap.delete(key)
        return
      }
      let fns = eventMap.get(key)
      fns = fns?.filter((item)=> fn !== item)
      eventMap.set(key, fns)
    }
  }
  return emitter
}

const globalEmitter = createEmitter()

export default globalEmitter