import { emitter, pipe } from "@/events"

export interface Lifecycle{
  mounted(): void
  update(): void
  unMounted(): void
}

export function lifecycle(options: Partial<Lifecycle>) {
  const lifecycleEmitter = emitter.createEmitter()
  if (options?.mounted) {
    const mounted = pipe.useNextTick(options.mounted)
    lifecycleEmitter.on('mountedHook', mounted)
  }
  if (options?.update) {
    const update = pipe.useNextTick(options.update)
    lifecycleEmitter.on('updateHook', update)
  }
  if (options?.unMounted) {
    const unMounted = pipe.useNextTick(options.unMounted)
    lifecycleEmitter.on('unMountedHook', unMounted)
  }
  return lifecycleEmitter
}