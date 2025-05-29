import OlMap from 'ol/Map'
import { Emitter } from '../events/emitter'
import { createLayer, type LayerOptions, type Layer, type Element, type ElementType, type PointData, type CircleData, type ElementData } from './layers'
export { type Layer, type Element, type ElementType, type PointData, type CircleData, type ElementData }

export interface LayerManager {
  create(options?: LayerOptions): Layer
  add(layer: Layer): void
  remove(layer: Layer): void
  clean(): void
  destroy(): void
  getLayers(): Layer[]
  getLayerById(layerId: number): Layer | undefined
}

/**
 * 图层管理器负责图层创建、添加、移除、清空
 * 同时也能通过图层id来获取图层、getLayers获取当前全部图层
 */
export function createLayerManager(olMap: OlMap,  emitter: Emitter): LayerManager {
  const layers: Layer[] = []
  const layerManager: LayerManager = {
    create(options?: LayerOptions) {
      const layer = createLayer(emitter, options)
      layerManager.add(layer)
      emitter.emit('layer:create', layer)
      return layer
    },
    add(layer: Layer) {
      if (!layer) return 
      const layerMatcher = layers.findIndex((item) => item.id === layer.id)
      if (layerMatcher !== -1) return 
      const olLayer = layer.getOlLayer()
      olMap.addLayer(olLayer)
      layers.push(layer)
      emitter.emit('layer:add', layer)
    },
    remove(layer: Layer) {
      if (!layer) return 
      const layerMatcher = layers.findIndex((item) => item === layer)
      if (layerMatcher === -1) return
      const olLayer = layer.getOlLayer()
      olMap.removeLayer(olLayer)
      layers.splice(layerMatcher, 1)
      emitter.emit('layer:remove', layer)
    },
    clean() {
      if (!layerManager) return 
      for (const layer of layers) {
        layerManager.remove(layer)
        layer.destroy()
      }
      emitter.emit('layer:clean', layers)
    },
    destroy() {
      layerManager.clean()
    },
    getLayerById(id: number) {
      return layers.find((layer) => id === layer.id)
    },
    getLayers() {
      return layers
    }
  }
  return layerManager
}