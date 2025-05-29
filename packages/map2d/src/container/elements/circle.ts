import OlCircle from 'ol/geom/Circle'
import OlFeature from 'ol/Feature'
import type { ElementPluginOptions, CircleData } from './types'
import { createElementCommon } from './common'

export interface CirclePluginOptions extends ElementPluginOptions<CircleData> {}

export function createElement(options: CirclePluginOptions) {
  const center = options.data?.center ?? []
  const radius  = options.data?.radius ?? 0
  const olCircle = new OlCircle(center, radius)
  const olFeature = new OlFeature({ 
    geometry: olCircle
  })
  const element = createElementCommon(olCircle, olFeature, options)
  element.setStyle(options.style!)
  element.setRotate(element.rotate)
  return element
}