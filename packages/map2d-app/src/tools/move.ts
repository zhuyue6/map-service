import { App, Plugin } from '../types'
import { Element } from '../elements/types'
import { syncElementsDataEmit } from '../elements'
import { Element as SElement, createMoveInteractive } from '@web-map-service/map2d'

function makeTool(app: App) {
  const { interactiveManager, emitter } = app.map
  const sMove = createMoveInteractive(interactiveManager, false)
  const { select } =  app.tools

  function moveElement(sElements: SElement[]) {
    if (!sElements) {
      return
    }

    if (sElements.length === 0) {
      return
    }

    const elements: Element[] = syncElementsDataEmit(app, sElements)

    app.emitter.emit('element:move', elements)
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
      if (!element) return
      const matcher = elmements.findIndex((item) => item.id === element.id)
      if (matcher !== -1) return
      sMove.add(element.getSElement())
      elmements.push(element)
    },
    remove(element: Element) {
      if (!element) return
      const matcher = elmements.findIndex((item) => item.id === element.id)
      if (matcher === -1) return
      sMove.remove(element.getSElement())
      elmements.splice(matcher, 1)
    },
    clean() {
      sMove.clean()
      elmements = []
    },
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
      emitter.on('element:move', moveElement)
      sMove.enable()
      select.enable()
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
      emitter.remove('element:move', moveElement)
      sMove.close()
      select.close()
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

declare module '../types' {
  interface AppEmitterEvent {
    'element:move': any
  }
}