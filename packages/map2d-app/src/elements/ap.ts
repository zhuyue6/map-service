import type { Layer as SLayer, CircleData,  Element as SElement } from '@web-map-service/map2d'
import type {  App, Plugin } from '../types'
import type {  Element, CreateElementOption } from './types'
import { createLayerCommon, createElementCommon } from './common'

const fillColor = '#f0fae6'

function createElement(app: App, sLayer: SLayer, options: CreateElementOption): Element {
  const sElement: SElement<'circle'> = sLayer.create({
    type: 'circle',
    data: options.data as CircleData,
    rotate: options.rotate,
    style: {
      fill: {
        color: fillColor
      }
    }
  })
  
  const element: Element = createElementCommon(app, sElement, options)
  return element
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'ap',
    install(_app: App) {
      app = _app
      const layer = createLayerCommon(app, { 
        createElement
      })
      app.element.addLayer(layer)
      return app
    }
  }
  return plugin
}
