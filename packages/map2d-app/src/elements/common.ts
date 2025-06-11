import { App } from '../types'
import type { Element, Layer, ElementOptions, CreateElementOption } from './types'
import { Layer as SLayer, Element as SElement, Style, ElementData, getElementData, ElementType as SElementType} from '@web-map-service/map2d'
import {ElementEmitter} from './element'

let layerId = 0
let elementId = 0
interface LayerOptions {
  type: string
  name?: string
  createElement(app: App, sLayer: SLayer, options: CreateElementOption): Element
  sElementType: SElementType[]
}

export function createLayerCommon(app: App, layerOptions: LayerOptions) {
  layerId++
  const { container: { layerManager } } = app.map
  const sLayer = layerManager.create({})
  const elements: Element[] = []
  const layer: Layer = {
    id: layerId,
    name: layerOptions.name,
    type: layerOptions.type,
    sElementType: layerOptions.sElementType,
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
    remove(element: Element) {
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

export function createElementCommon(app: App, sLayer: SLayer, options: ElementOptions) {
  elementId++
  const sElement: SElement<SElementType> = sLayer.create({
    type: options.sElementType!,
    data: options.data,
    rotate: options.rotate,
    style: options.style
  }, false)

  const element: Element = {
    id:  options.id ?? elementId,
    type: options.type,
    name: options.name,
    get props() {
      return sElement.props
    },
    setProps(props: Record<string, unknown>) {
      return sElement.setProps(props)
    },
    setName(name: string) {
      sElement.setName(name)
    },
    get rotate() {
      return sElement.rotate
    },
    setRotate(rotate: number) {
      return sElement.setRotate(rotate)
    },
    getSElement() {
      return sElement
    },
    get style() {
      return sElement.style
    },
    setStyle(style: Style) {
      sElement.setStyle(style)
    },
    get data() {
      return sElement['data']
    },
    setData(data: ElementData) {
      sElement.setData(data)
    }
  }

  return element
}

/**
  通过app和服务元素来找到应用元素, 通过打标属性appLayerType、appElementId找到Element
 */
  export function getElementBySElement(app: App, sElement: SElement) {
    const layerType = sElement.props.appLayerType
    const elementId =  sElement.props.appElementId
    const layer = app.element.getLayerByType(layerType as string)
    if (!layer) return
    const element = layer.getElementById(elementId as number)
    if (!element) return
    return element
  }

/**
 * SElement更新data通知同步一下element数据主要是为了触发一下update反射
 */
export function syncElementsDataEmit(app: App, sElements: SElement[]) {
  const elements: Element[] = []
  const elementSetDataItems: ElementSetDataItem[] = []
  for (const sElement of sElements) {
    const olFeature = sElement.getOlFeature()
    const olGeometry = olFeature.getGeometry()
    if (!olGeometry) continue
    const data = getElementData(olGeometry)
    const element = getElementBySElement(app, sElement)
    if(element && data) {
      elements.push(element)
      elementSetDataItems.push({
        element,
        data: {
          data
        }
      })
    }
  }
  
  setElementsData(elementSetDataItems, app.emitter)
  return elements
}



export interface ElementSetDataItem {
  element: Element
  data: Partial<{
    data: Element['data']
    style: Element['style']
    rotate: Element['rotate']
    name: Element['name']
  }>
}


function setElementData(elementSetDataItem: ElementSetDataItem) {
  const element = elementSetDataItem.element
  const data = elementSetDataItem.data
  if (data.data) {
    element.setData(data.data)
  }
  if (data.name) {
    element.setName(data.name)
  }
  if (data.rotate) {
    element.setRotate(data.rotate)
  }
  if (data.style) {
    element.setStyle(data.style)
  }
}


/**
 * 同步数据入口
 * @param data 
 * @param emitter 
 */
export function setElementsData(data: ElementSetDataItem[], emitter: App['emitter'], useSync=true) {
  emitter.emit(ElementEmitter.update, data)

  // 不进行数据同步，仅抛出回调事件
  if (!useSync) return

  for(const item of data) {
    setElementData(item)
  }
}