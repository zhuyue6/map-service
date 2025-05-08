import OlLineString from 'ol/geom/LineString'
import type { BaseElementOptions, PointData } from './types'

export interface LinePluginOptions extends BaseElementOptions<PointData> {}

export function linePlugin(options: LinePluginOptions) {
  const data = options.data ?? []
  const olLineString = new OlLineString(data)
  return olLineString
}