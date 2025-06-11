import { App, Plugin } from '../types'
import { Element } from '../elements/types'

function makeTool(app: App) {
  const move = app.tools.move
  const modify = app.tools.modify

  function editElement(elements: Element[]) {
    app.emitter.emit('element:edit', elements)
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      move.enable()
      modify.enable()
      app.emitter.on('element:move', editElement)
      app.emitter.on('element:modify', editElement)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      move.clean()
      modify.clean()
      move.close()
      modify.close()
      app.emitter.remove('element:move', editElement)
      app.emitter.remove('element:modify', editElement)
    }
  }
  return tool
}


export function createPlugin() {
  // 编辑插件依赖select、move、modify插件
  let app: App
  const plugin: Plugin = {
    type: 'edit',
    depend: ['select', 'move', 'modify'],
    install(_app: App) {
      app = _app
      app.tools.edit = makeTool(app)
      return app
    }
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    edit: ReturnType<typeof makeTool>
  }
}

declare module '../types' {
  interface AppEmitterEvent {
    'element:edit': any
  }
}