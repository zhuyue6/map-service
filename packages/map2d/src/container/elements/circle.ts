import OlCircle from 'ol/geom/Circle'
import type { BaseElementOptions, CircleData } from './types'

export interface CirclePluginOptions extends BaseElementOptions<CircleData> {}

export function circlePlugin(options: CirclePluginOptions) {
  const center = options.data?.center ?? []
  const radius  = options.data?.radius ?? 0
  const olCircle = new OlCircle(center, radius)
  return olCircle
}