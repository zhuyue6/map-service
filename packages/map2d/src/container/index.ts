import OlMap from 'ol/Map'
import { createBaseMap, BaseMap, type BaseMapOptions } from './baseMap'
import { createLayerManager, LayerManager } from './layerManager'
export  { BaseMapOptions }
export interface Container {
  baseMap: BaseMap
  layerManager: LayerManager
}

export function createContainer(olMap: OlMap,  baseMapoptions?: BaseMapOptions): Container {
  const baseMap = createBaseMap(baseMapoptions)
  olMap.addLayer(baseMap.getOlLayer())
  const layerManager = createLayerManager(olMap)
  const container: Container = {
    baseMap,
    layerManager
  }
  return container
}