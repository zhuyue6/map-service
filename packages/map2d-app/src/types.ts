import { type Map2D, type BaseMap, type View, events } from '@web-map-service/map2d'


export interface AppEmitterEvent {}

export interface App extends ComponentCustomProperties {
  emitter: events.emitter.Emitter<AppEmitterEvent>
  baseMap: BaseMap
  view: View
  plugins: Plugin[]
  map: Map2D
  getPluginByType(type: string): Plugin | undefined
  use<T extends Record<string, unknown>>(plugin: Plugin<T>, options?: any): App & T
}

export interface ComponentCustomProperties {}


export interface PluginOptions {
  type: string,
  options?: Record<string, unknown>
}

export interface Plugin<T = Record<string, unknown>> {
  depend?: string[]
  type: string
  install(app: App & T, options?: any): void
  uninstall?(): void
}


