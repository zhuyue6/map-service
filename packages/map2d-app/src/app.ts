import { createMap, type Map2DOptions, events } from '@web-map-service/map2d'
import { type App, type Plugin, type PluginOptions } from './types'
import { register, dependPluginRegister } from './setup/plugin'


export interface AppOptions {
  el:  Map2DOptions['el']
  baseMap?: Map2DOptions['baseMap'],
  view?: Map2DOptions['view'],
  plugins?: PluginOptions[]
}

export function createApp(options: AppOptions): App {
  const map = createMap({
    el: options.el,
    baseMap: options.baseMap,
    view: options.view,
  })

  const { container: { baseMap }, view } = map
  const plugins: Plugin[] = []
  const emitter = events.emitter.createEmitter()

  const app: Partial<App> = {
    baseMap,
    view,
    emitter,
    get plugins() {
      return plugins
    },
    get map() {
      return map
    },
    getPluginByType(type: string) {
      return plugins.find((item) => item.type === type)
    },
    use<T extends Record<string, unknown>>(plugin: Plugin<T>, options?: any): App & T {
      // 查看是否已经存在该类型插件
      const match = app.getPluginByType!(plugin.type)
      if (match) return app as App & T

      // 注册依赖插件，如果依赖插件注册失败直接返回
      if (!dependPluginRegister(app as App & T, plugin, options)) {
        return app as App & T
      }
      
      plugin.install(app as App & T, options)
      plugins.push(plugin)
      return app as App & T
    }
  }

  // 注入元素管理器插件
  register(app as App, options.plugins)
  return app as App
}