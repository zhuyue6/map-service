import type { BaseElement } from './types'
import { circlePlugin, type CirclePluginOptions } from './circle'
import { polygonPlugin, PolygonPluginOptions } from './polygon'
import { linePlugin, LinePluginOptions } from './line'
import { setStyle } from '../../style'
import { Geometry as OlGeometry, LineString as OlLineString, Polygon as OlPolygon, Circle as OlCircle } from 'ol/geom'
import OlFeature from 'ol/Feature'
import { CircleData, PointData } from './types'
import { type Container } from '../../container'

let id: number = 0;

export interface ElementPluginsMap {
  line: {
    options: LinePluginOptions,
    instance: ReturnType<typeof linePlugin>
  }
  circle: {
    options: CirclePluginOptions,
    instance: ReturnType<typeof circlePlugin>
  }
  polygon: {
    options: PolygonPluginOptions,
    instance: ReturnType<typeof polygonPlugin>
  }
  rect: {
    options: PolygonPluginOptions,
    instance: ReturnType<typeof polygonPlugin>
  }
}

export interface Element<D = any> extends BaseElement<D> {
  type: keyof ElementPluginsMap
}

export type ElementType = keyof ElementPluginsMap

const elementPlugins: {
  [T in ElementType]: (options: ElementPluginsMap[T]['options']) => ElementPluginsMap[T]['instance']
} = {
  line: (options: ElementPluginsMap['line']['options']) => linePlugin(options),
  circle: (options: ElementPluginsMap['circle']['options']) => circlePlugin(options),
  polygon: (options: ElementPluginsMap['polygon']['options']) => polygonPlugin(options),
  rect: (options: ElementPluginsMap['rect']['options']) => polygonPlugin(options)
}

export function createElement<T extends ElementType>(options: ElementPluginsMap[T]['options'] & {
  type: T
}, layerId: number) {
  id++
  const olGeometry  = elementPlugins[options.type](options)
  const olFeature = new OlFeature({ 
    geometry: olGeometry,
    elementId: id,
    layerId: layerId
  })
  setStyle(olFeature, options.style)
  const element: Element<ElementPluginsMap[T]['options']['data']> = {
    id,
    layerId,
    type: options.type,
    name: options.name,
    data: options.data,
    style: options.style,
    getOlFeature() {
      return olFeature
    }
  }
  return element
}

type ElementData = CircleData | PointData

/**
 *  线段和矩形是 PointData Array<[number, number]>
 *  圆形是 CircleData { center: number[], radius: number }
 */
export function getElementData(olGeometry: OlGeometry): ElementData {
  if (olGeometry instanceof OlLineString) {
    return olGeometry.getCoordinates() as PointData
  }
  if (olGeometry instanceof OlPolygon) {
    return (olGeometry.getCoordinates()?.[0] ?? []) as PointData
  }
  if (olGeometry instanceof OlCircle) {
    return {
      center: olGeometry.getCenter(),
      radius: olGeometry.getRadius()
    } as CircleData
  }
  return ((olGeometry as OlPolygon).getCoordinates()?.[0] ?? []) as PointData
}

export function getElementByOlFeature(olFeature: OlFeature, container: Container) {
  const olFeatureProps = olFeature.getProperties()
  const { layerId, elementId } = olFeatureProps
  const layer = container.layerManager.getLayerById(layerId)
  if (layer) {
    return layer.getElementById(elementId)
  }
}

/**
 * 通过olFeature里面的数据直接同步到element上
 * @param OlFeature 
 * @param Container 
 * @returns boolean
 */
export function syncFeatureElementData(olFeature: OlFeature, container: Container) {
  const olGeometry = olFeature.getGeometry()
  if (!olGeometry) { 
    return
  }
  const data = getElementData(olGeometry)
  const element = getElementByOlFeature(olFeature, container)
  if (element) {
    element.data = data
  }
}