import { type Element, type Layer, type PointData } from '@web-map-service/map2d'

interface RoadNetworkOptions {
  data: PointData
}

const fillColor = '#f0fae6'

export function createRoadNetwork(layer: Layer, options: RoadNetworkOptions) {
  const element: Element<'line'> = layer.create({
    type: 'line',
    data: options.data,
    style: {
      fill: {
        color: fillColor
      }
    }
  })

  return element
}