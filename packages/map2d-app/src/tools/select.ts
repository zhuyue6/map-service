import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { getElementBySElement } from '../elements'
import { Element as SElement, createSelectInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sSelect = createSelectInteractive(interactiveManager)

  function selectElement(sElements: SElement[]) {
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
      elements.push(element)
    }

    app.emitter.emit('select', elements)
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      sSelect.enable()
      emitter.on('select', selectElement)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('select', selectElement)
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