import { createMeasureInteractive } from '@web-map-service/map2d'
import { App, Plugin } from '../types'

type MeasureType = 'distance' | 'area' | 'angle'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map

  function emit(data: string) {
    app.emitter.emit('measure', data)
  }

  const sMeasure = createMeasureInteractive(interactiveManager)
  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      emitter.on('measure', emit)
      sMeasure.enable()
    },
    use(type: MeasureType) {
      sMeasure.use(type)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('measure', emit)
      sMeasure.close()
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'measure',
    install(_app: App) {
      app = _app
      app.tools.measure = makeTool(app)
      return app
    }
  }

  return plugin
}

declare module './tool' {
  interface Tools {
    measure: ReturnType<typeof makeTool>
  }
}


declare module '../types' {
  interface AppEmitterEvent {
    measure: any
  }
}