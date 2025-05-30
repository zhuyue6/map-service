import { DrawType, type DrawEmit, createDrawInteractive } from '@web-map-service/map2d'
import { App, Plugin } from '../types'

function makeTool(app: App) {
  const { interactiveManager, emitter: sEmitter } = app.map
  const sDraw = createDrawInteractive(interactiveManager)
  // 默认使用的元素图层第一位的图层
  const layer = app.element.getLayers()?.[0]
  let useLayerType = layer?.type
  
  function createElement(drawData: DrawEmit) {
    const element = app.element.create({
      type: useLayerType,
      data: drawData.data
    })
    app.emitter.emit('draw', element)
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      sEmitter.on('draw', createElement)
      tool.use(useLayerType)
      sDraw.enable()
    },
    use(type: string) {
      useLayerType = type
      const layer = app.element!.getLayerByType(useLayerType)
      if (!layer) return 
      sDraw.use(layer.sElementType as DrawType)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      sEmitter.remove('draw', createElement)
      sDraw.close()
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'draw',
    install(_app: App) {
      app = _app
      app.tools.draw = makeTool(app)
      return app
    },
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    draw: ReturnType<typeof makeTool>
  }
}