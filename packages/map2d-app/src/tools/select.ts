import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { getElementBySElement } from '../elements'
import { Element as SElement, createSelectInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sSelect = createSelectInteractive(interactiveManager)

  let elements: Element[] = []

  function selectElement(sElements: SElement[]) {
    const list = Array.isArray(sElements) ? sElements : []
    elements = []

    for (const sElement of list) {
      const element = getElementBySElement(app, sElement)
      if (!element) continue
      elements.push(element)
    }

    app.emitter.emit('element:select', elements)
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      sSelect.enable()
      emitter.on('element:select', selectElement)
    },
    add(element: Element){
      sSelect.add(element.getSElement())
    },
    remove(element: Element) {
      sSelect.remove(element.getSElement())
    },
    getSelected() {
      return elements
    },
    clean() {
      sSelect.clean()
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      sSelect.clean()
      emitter.remove('element:select', selectElement)
      sSelect.close()
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'select',
    install(_app: App) {
      app = _app
      app.tools.select = makeTool(app)
      return app
    }
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    select: ReturnType<typeof makeTool>
  }
}

declare module '../types' {
  interface AppEmitterEvent {
    'element:select': any
  }
}