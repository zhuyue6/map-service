import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { getElementBySElement, syncElementData } from '../elements'
import { Element as SElement, createModifyInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sModify = createModifyInteractive(interactiveManager, false)

  function modifyElement(sElements: SElement[]) {
    if (!sElements) {
      return
    }

    if (sElements.length === 0) {
      return
    }

    const elements: Element[] = []

    for (const sElement of sElements) {
      const element = getElementBySElement(app, sElement)
      if (!element) continue
      syncElementData(element, sElement)
      elements.push(element)
    }

    app.emitter.emit('modify', elements)
  }

  const elmements: Element[] = []
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
      for(const element of elmements) {
        tool.remove(element)
      }
    },
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      sModify.enable()
      emitter.on('modify', modifyElement)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('modify', modifyElement)
      sModify.close()
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