import type { Layer as SLayer } from '@web-map-service/map2d'
import type {  App, Plugin } from '../types'
import type {  Element, CreateElementOption } from './types'
import { createLayerCommon, createElementCommon } from './common'

const fillColor = '#f0fae6'
const type = 'area'

// 区域比较特别有多种形状包括矩形、多边形、圆形
function createElement(app: App, sLayer: SLayer, options: CreateElementOption): Element {
  const areaOptions = {
    type,
    style: {
      fill: {
        color: fillColor
      }
    }
  }
  
  const element: Element = createElementCommon(app, sLayer, {
    ...options,
    ...areaOptions
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
        sElementType: ['rect', 'polygon', 'circle']
      })
      app.element.addLayer(layer)
      return app
    }
  }
  return plugin
}
