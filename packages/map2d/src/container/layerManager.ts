import OlMap from 'ol/Map'
import { createLayer, type LayerOptions, type Layer } from './layers'


export interface LayerManager {
  create(options: LayerOptions): Layer
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
export function createLayerManager(olMap: OlMap): LayerManager {
  const layers: Layer[] = []
  const layerManager: LayerManager = {
    create(options: LayerOptions) {
      const layer = createLayer(options)
      layerManager.add(layer)
      return layer
    },
    add(layer: Layer) {
      if (!layer) return 
      const layerMatcher = layers.findIndex((item) => item.id === layer.id)
      if (layerMatcher !== -1) return 
      const olLayer = layer.getOlLayer()
      olMap.addLayer(olLayer)
      layers.push(layer)
    },
    remove(layer: Layer) {
      if (!layer) return 
      const layerMatcher = layers.findIndex((item) => item === layer)
      if (layerMatcher === -1) return
      const olLayer = layer.getOlLayer()
      olMap.removeLayer(olLayer)
      layers.splice(layerMatcher, 1)
    },
    clean() {
      if (!layerManager) return 
      for (const layer of layers) {
        layerManager.remove(layer)
        layer.destroy()
      }
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