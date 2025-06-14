import type { Layer as SLayer, ElementType } from '@web-map-service/map2d'
import type {  App, Plugin } from '../types'
import type {  Element, CreateElementOption } from './types'
import { createLayerCommon, createElementCommon } from './common'

const fillColor = '#f0fae6'
const type = 'ap'

function createElement(app: App, sLayer: SLayer, options: CreateElementOption): Element {
  const apOptions = {
    type,
    sElementType: 'circle' as ElementType,
    style: {
      fill: {
        color: fillColor
      }
    }
  }
  
  const element: Element = createElementCommon(app, sLayer, {
    ...options,
    ...apOptions
  })
  return element
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type,
    install(_app: App) {
      app = _app
      const layer = createLayerCommon(app, { 
        type,
        createElement,
        sElementType: ['circle']
      })
      app.element.addLayer(layer)
      return app
    }
  }
  return plugin
}
