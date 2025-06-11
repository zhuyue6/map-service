import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { syncElementsDataEmit } from '../elements'
import { Element as SElement, createModifyInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sModify = createModifyInteractive(interactiveManager, false)
  const { select } =  app.tools
  function modifyElement(sElements: SElement[]) {
    if (!sElements) {
      return
    }

    if (sElements.length === 0) {
      return
    }

    const elements: Element[] = syncElementsDataEmit(app, sElements)

    app.emitter.emit('element:modify', elements)
  }

  app.emitter.on('element:select', (selectd: Element[]) => {
    tool.clean()
    for (const element of selectd) {
      tool.add(element)
    }
  })

  let elmements: Element[] = []
  const tool = {
    enabled: false,
    add(element: Element) {
      const matcher = elmements.findIndex((item) => item.id === element.id)
      if (matcher !== -1) return
      sModify.add(element.getSElement())
      elmements.push(element)
    },
    remove(element: Element) {
      sModify.remove(element.getSElement())
      const matcher = elmements.findIndex((item) => item.id === element.id)
      if (matcher === -1) return
      elmements.splice(matcher, 1)
    },
    clean() {
      sModify.clean()
      elmements = []
    },
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      emitter.on('element:modify', modifyElement)
      sModify.enable()
      select.enable()
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('element:modify', modifyElement)
      sModify.close()
      select.close()
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'modify',
    install(_app: App) {
      app = _app
      app.tools.modify = makeTool(app)
      return app
    }
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    modify: ReturnType<typeof makeTool>
  }
}


declare module '../types' {
  interface AppEmitterEvent {
    'element:modify': any
  }
}