import OlMap from 'ol/Map'
import { Emitter } from '../events/emitter'
import { createBaseMap, type BaseMap, type BaseMapOptions, type Extent } from './baseMap'
import { createLayerManager, type LayerManager, type Layer, type Element, type ElementType, type PointData, type CircleData, type ElementData } from './layerManager'

export  { type BaseMap, type BaseMapOptions, type Extent, type LayerManager, type Layer, type Element, type ElementType, type PointData, type CircleData, type ElementData }
export  { getElementData } from './elements'
export interface Container {
  baseMap: BaseMap
  layerManager: LayerManager
}

export function createContainer(olMap: OlMap, emitter: Emitter, baseMapoptions?: BaseMapOptions): Container {
  const baseMap = createBaseMap(olMap, baseMapoptions)
  const layerManager = createLayerManager(olMap, emitter)
  const container: Container = {
    baseMap,
    layerManager
  }
  return container
}