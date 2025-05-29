import OlPoint from 'ol/geom/Point'
import OlFeature from 'ol/Feature'
import type { ElementPluginOptions, Coord, ElementImage } from './types'
import { type Style } from '../../style'
import type { Element } from './element'
import { getElementOlStyle, createElementCommon } from './common'

export interface ImagePluginOptions extends ElementPluginOptions<Coord> {
  image: ElementImage
}

export function createElement(options: ImagePluginOptions) {
  const data = options.data ?? []
  const olPoint = new OlPoint(data)
  const olFeature = new OlFeature({ 
    geometry: olPoint
  })

  const elmentCommon = createElementCommon(olPoint, olFeature, options)

  const element = {
    ...elmentCommon,
    setRotate(rotate: number) {
      element.rotate = rotate
      element.setStyle(options.style!)
    },
    setStyle(style: Style) {
      element.style = style
      const elementStyle = getElementOlStyle(element as Element)
      olFeature.setStyle(elementStyle)
    }
  }
  element.setStyle(options.style!)
  return element
}