import OlPolygon from 'ol/geom/Polygon'
import type { BaseElementOptions, PointData } from './types'

export interface PolygonPluginOptions extends BaseElementOptions<PointData> {}

export function polygonPlugin(options: PolygonPluginOptions) {
  const data = options.data ? [options.data] : [[]]
  const olPolygon = new OlPolygon(data)
  return olPolygon
}