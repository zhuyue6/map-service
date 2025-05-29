import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { getElementBySElement, syncElementData } from '../elements'
import { Element as SElement, createMoveInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sMove = createMoveInteractive(interactiveManager, false)

  function moveElement(sElements: SElement[]) {
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

    app.emitter.emit('move', elements)
  }

  const elmements: Element[] = []
  const tool = {
    enabled: false,
    add(element: Element) {
      const matcher = elmements.findIndex((item) => item.id === element.id)
      if (matcher !== -1) return
      sMove.add(element.getSElement())
      elmements.push(element)
    },
    remove(element: Element) {
      sMove.remove(element.getSElement())
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
      sMove.enable()
      emitter.on('move', moveElement)
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('move', moveElement)
      sMove.close()
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'move',
    install(_app) {
      app = _app
      app.tools.move = makeTool(app)
      return app
    }
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    move: ReturnType<typeof makeTool>
  }
}