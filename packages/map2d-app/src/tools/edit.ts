import { App, Plugin } from '../types'
import { Element } from '../elements/types'

function makeTool(app: App) {
  const select = app.tools.select
  const move = app.tools.move
  const modify = app.tools.modify

  function editElement(elements: Element[]) {
    app.emitter.emit('edit', elements)
  }

  function selectElement(elements: Element[]) {
    move.clean()
    modify.clean()
    for (const element of elements) {
      move.add(element)
      modify.add(element)
    }
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      select.enable()
      move.enable()
      modify.enable()
      app.emitter.on('select', selectElement)
      app.emitter.on('move', editElement)
      app.emitter.on('modify', editElement)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      move.clean()
      modify.clean()
      select.close()
      move.close()
      modify.close()
      app.emitter.on('select', selectElement)
      app.emitter.remove('move', editElement)
      app.emitter.remove('modify', editElement)
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