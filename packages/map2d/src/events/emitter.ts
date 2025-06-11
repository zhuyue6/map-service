import { util } from '../shared'

export interface Emitter<T = Record<string, unknown>> {
  on(key: keyof T, fn: Fn): void
  emit(key: keyof T, ...arg: any[]): void
  remove(key: keyof T, fn: Fn, clear?: boolean): void
}

export function createEmitter<T = Record<string, unknown>>(): Emitter<T> {
  const eventMap: Map<string, ((...arg: any[]) => void)[] | undefined> = new Map()
  const emitter: Emitter<T> = {
    on(key, fn) {
      const fns = eventMap.get(key as string)
      if (util.isUnDef(fns)) {
        eventMap.set(key as string, [fn])
        return
      }
      if (!fns!.includes(fn)) {
        fns?.push(fn)
      }
    },
    emit(key, ...arg) {
      const fns = eventMap.get(key as string)
      if (util.isDef(fns)) {
        for (const fn of fns!) {
          fn(...arg)
        }
      }
    },
    remove(key, fn, clear=false) {
      if (clear) {
        // 清除该key下所有绑定的事件
        eventMap.delete(key as string)
        return
      }
      const fns = eventMap.get(key as string)
      if (!fns) return
      const matcher = fns.findIndex((item)=> fn === item)
      if (matcher !== -1) fns.splice(matcher, 1) 
    }
  }
  return emitter
}

const globalEmitter = createEmitter()

export default globalEmitter