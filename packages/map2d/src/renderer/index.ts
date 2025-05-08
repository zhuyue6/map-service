import Map from 'ol/Map'
import { emitter } from "../events"

export interface Renderer {
  destroy(): void
  refresh(): void
}

export function createRenderer(
  map: Map,
  emitter: emitter.Emitter
): Renderer {
  const renderer: Renderer = {
    refresh() {
      emitter.emit('updateHook')
    },
    destroy() {
      map.dispose()
      emitter.emit('unMountedHook')
    }
  }

  return renderer
}