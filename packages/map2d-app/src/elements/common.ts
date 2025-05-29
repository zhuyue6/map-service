import { App } from '../types'
import type { Element, Layer, CreateElementOption } from './types'
import { Layer as SLayer, Element as SElement, Style, ElementData, getElementData} from '@web-map-service/map2d'

let layerId = 0
let elementId = 0
interface LayerOptions {
  createElement(app: App, sLayer: SLayer, options: CreateElementOption): Element
}

export function createLayerCommon(app: App, layerOptions: LayerOptions) {
  layerId++
  const { container: { layerManager } } = app.map
  const sLayer = layerManager.create({})
  const elements: Element[] = []
  const layer: Layer = {
    id: layerId,
    type: 'ap',
    sElementType: 'circle',
    create(options) {
      const element = layerOptions.createElement(app, sLayer, options)
      return element
    },
    add(element: Element) {
      const matcher = elements.findIndex((item) => item.id === element.id)
      if (matcher !== -1) return 
      sLayer.add(element.getSElement())
      elements.push(element)
    },
    remove(element) {
      const matcher = elements.findIndex((item) => item.id === element.id)
      if (matcher === -1) return 
      sLayer.remove(element.getSElement())
      elements.splice(matcher, 1)
    },
    getElements() {
      return elements
    },
    getElementById(id: number) {
      const element = elements.find((item) => item.id === id)
      return element
    }
  }
  return layer
}

export function createElementCommon(app: App, sElement: SElement, options: CreateElementOption) {
  elementId++
  const element: Element = {
    id:  options.id ?? elementId,
    type: 'ap',
    name: options.name,
    setName(name: string) {
      app.emitter.emit('element:updateBefore', {
        element,
        name
      })
      sElement.setName(name)
    },
    get rotate() {
      return sElement.rotate
    },
    setRotate(rotate: number) {
      app.emitter.emit('element:updateBefore', {
        element,
        rotate
      })
      return sElement.setRotate(rotate)
    },
    getSElement() {
      return sElement
    },
    get style() {
      return sElement.style
    },
    setStyle(style: Style) {
      app.emitter.emit('element:updateBefore', {
        element,
        style
      })
      sElement.setStyle(style)
    },
    get data() {
      return sElement['data']
    },
    setData(data: ElementData) {
      app.emitter.emit('element:updateBefore', {
        element,
        data
      })
      sElement.setData(data)
    }
  }

  return element
}

/**
 * 同步一下element数据主要是为了触发一下setData
 */
export function syncElementData(element: Element, sElement: SElement) {
  const olFeature = sElement.getOlFeature()
  const olGeometry = olFeature.getGeometry()
  if (olGeometry) { 
    const data = getElementData(olGeometry)
    element.setData(data)
  }
}