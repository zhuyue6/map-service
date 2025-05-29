import OlPolygon from 'ol/geom/Polygon'
import OlFeature from 'ol/Feature'
import type { ElementPluginOptions, PointData } from './types'
import { createElementCommon } from './common'

export interface PolygonPluginOptions extends ElementPluginOptions<PointData> {}

export function createElement(options: PolygonPluginOptions) {
  const data = options.data ? [options.data] : [[]]
  const olPolygon = new OlPolygon(data)
  const olFeature = new OlFeature({ 
    geometry: olPolygon
  })

  const element = createElementCommon(olPolygon, olFeature, options)
  element.setStyle(options.style!)
  element.setRotate(element.rotate)
  return element
}