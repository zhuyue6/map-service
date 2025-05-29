import { type Element, type Layer, type PointData } from '@web-map-service/map2d'

interface ElevatorOptions {
  data: PointData
}

const fillColor = '#f0fae6'

export function createElevator(layer: Layer, options: ElevatorOptions) {
  const element: Element<'polygon'> = layer.create({
    type: 'polygon',
    data: options.data,
    style: {
      fill: {
        color: fillColor
      }
    }
  })

  return element
}