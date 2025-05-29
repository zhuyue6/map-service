import OlLineString from 'ol/geom/LineString'
import OlFeature from 'ol/Feature'
import type { ElementPluginOptions, PointData } from './types'
import { createElementCommon } from './common'

export interface LinePluginOptions extends ElementPluginOptions<PointData> {}

export function createElement(options: LinePluginOptions) {
  const data = options.data ?? []
  const olLineString = new OlLineString(data)

  const olFeature = new OlFeature({ 
    geometry: olLineString
  })
  const element = createElementCommon(olLineString, olFeature, options)
  element.setStyle(options.style!)
  element.setRotate(element.rotate)
  return element
}