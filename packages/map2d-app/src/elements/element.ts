import { type App, type Plugin } from '../types'
import { type Layer, type ElementPlugin, type ElementPluginExtend } from './types'
import { Element as SElement } from '@web-map-service/map2d'

// 元素id
let id = 0

/**
 * 元素插件，提供app元素操作能力
 */
export function createPlugin() {
  const plugin: Plugin<ElementPluginExtend> = {
    type: 'element',
    install(_app: App) {
      // 每一个插件提供给元素插件
      const app = _app
      const layers: Layer[] = []
      const emitter = _app.emitter
      const elementPlugin: ElementPlugin = {
        create(options) {
          id++
          const { type, ...createOptions} = options
          const layer = elementPlugin.getLayerByType(type)
          if (!layer) return 
          // 如果参数里带有id则使用原来的id值
          const elementId = createOptions.id !== undefined ? createOptions.id : id
          const element = layer.create({ ...createOptions, id: elementId})
          if (!element) return
          elementPlugin.add(element)
          const sElement = element.getSElement()

          // 地图服务element属性打标地图应用数据，提供索引效率
          sElement.setProps({
            appLayerType: type,
            appElementId: element.id
          })

          emitter.emit('element:created', element)
          return element
        },
        add(element) {
          const layer = elementPlugin.getLayerByType(element.type)
          if (!layer) return
          layer.add(element)
          emitter.emit('element:added', element)
        },
        remove(element) {
          const appLayer = elementPlugin.getLayerByType(element.type)
          appLayer!.remove(element)
          emitter.emit('element:removed', element)
        },
        getLayers() {
          return layers
        },
        getLayerById(id: number) {
          const layer = layers.find((layer)=> layer.id === id)
          return layer
        },
        getLayerByType(type) {
          const layer = layers.find((layer)=> layer.type === type)
          return layer
        },
        addLayer(layer) {
          layers.push(layer)
        },
        removeLayer(layer) {
          const matcher = layers.findIndex((item) => item.id === layer.id)
          if (matcher === -1) return
          layers.splice(matcher, 1)
        }
      }
      app.element = elementPlugin
      return app 
    }
  }
  return plugin
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

declare module '../types' {
  interface ComponentCustomProperties {
    element: ElementPlugin;
  }
}