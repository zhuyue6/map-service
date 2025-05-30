import type { Coord, CircleData, PointData, ElementPluginOptions } from './types'
import { Geometry as OlGeometry, LineString as OlLineString, Polygon as OlPolygon, Circle as OlCircle, Point as OlPoint } from 'ol/geom'
import OlFeature from 'ol/Feature'
import { type Container, Element } from '../../container'
import { getStyle, type Style, setStyle } from '../../style'
import OlStyle from 'ol/style/Style'
import { getCenter } from 'ol/extent'

export type ElementData = CircleData | PointData | Coord

/**
 *  线段和矩形是 PointData Array<[number, number]>
 *  圆形是 CircleData { center: number[], radius: number }
 *  图片是 Coord [number, number]
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
  if (olGeometry instanceof OlPoint) {
    return olGeometry.getCoordinates() as Coord
  }
  return ((olGeometry as OlPolygon).getCoordinates()?.[0] ?? []) as PointData
}

export function getLayerByOlFeature(olFeature: OlFeature, container: Container) {
  const olFeatureProps = olFeature.getProperties()
  const { layerId } = olFeatureProps
  const layer = container.layerManager.getLayerById(layerId)
  if (layer) {
    return layer
  }
}

export function getElementByOlFeature(olFeature: OlFeature, container: Container) {
  const olFeatureProps = olFeature.getProperties()
  const { layerId, elementId } = olFeatureProps
  const layer = container.layerManager.getLayerById(layerId)
  if (layer) {
    return layer.getElementById(elementId)
  }
}

function isCircleData(data: ElementData): data is CircleData {
  return (data as CircleData).center !== undefined || (data as CircleData).radius !== undefined
}

function isPointData(data: ElementData): data is PointData {
  return Array.isArray((data as PointData)) &&  Array.isArray((data as PointData).at(0))
}

function isCoord(data: ElementData): data is Coord {
  return Array.isArray(data) && data.length === 2
}

/**
 * 数据同步到olFeatrue上
 * @param OlFeature 
 * @param Container 
 * @returns boolean
 */
export function syncDataFeature(data: ElementData, olFeature: OlFeature) {
  const olGeometry = olFeature.getGeometry()
  if (!olGeometry) { 
    return
  }

  if (isCircleData(data)) {
    if (olGeometry instanceof OlCircle) {
      olGeometry.setCenter((data as CircleData).center)
      olGeometry.setRadius((data as CircleData).radius)
      return
    }
  }

  if (isPointData(data)) {
    if (olGeometry instanceof OlLineString) {
      olGeometry.setCoordinates(data as PointData)
      return
    }
    if (olGeometry instanceof OlPolygon) {
      olGeometry.setCoordinates((data as PointData ? [data as PointData] : [[]]))
      return 
    }
  }
  if (isCoord(data)) {
    if (olGeometry instanceof OlPoint) {
      olGeometry.setCoordinates(data as Coord)
      return 
    }
  }
}

/**
 * 通过olFeature里面的数据直接同步到element上
 * @param OlFeature 
 * @param Container 
 * @returns boolean
 */
export function syncOlFeatureElementData(olFeature: OlFeature, container: Container) {
  const olGeometry = olFeature.getGeometry()
  if (!olGeometry) { 
    return
  }
  const data = getElementData(olGeometry)
  const element = getElementByOlFeature(olFeature, container)
  if (element) {
    element.setData(data)
  }
}

export function getElementOlStyle(element: Element) {
  const style: OlStyle = getStyle(element.style)
  if (element.type === 'image') {
    const imageStyle =  { 
      ...element.image, 
      rotation: (element.rotate ?? 0) * (Math.PI / 180)
    }
    return [
      getStyle({
        image: imageStyle
      }),
      style
    ]
  } else {
    return [style]
  }
}

export function createElementCommon(olGeometry: OlGeometry, olFeature: OlFeature, options: ElementPluginOptions) {
  const element = {
    id: options.id,
    layerId: options.layerId,
    type: options.type as Element['type'],
    name: options.name,
    image: options.image,
    data: options.data,
    rotate: options.rotate ?? 0, 
    style: options.style,
    get props() {
      return olFeature.getProperties()
    },
    setName(name: string) {
      element.name = name
    },

    setRotate(rotate: number) {
      element.rotate = rotate
      const center = getCenter(olGeometry.getExtent())
      olGeometry.rotate((360 - rotate) * (Math.PI / 180), center)
    },
    setProps(props: Record<string, unknown>) {
      olFeature.setProperties(props)
    },
    getOlFeature() {
      return olFeature
    },
    setStyle(style: Style) {
      const olFeature = element.getOlFeature()
      element.style = style
      setStyle(olFeature, style)
    },
    setData(data: Coord | CircleData | PointData) {
      element.data = data
      const olFeature = element.getOlFeature()
      syncDataFeature(data, olFeature)
    },
  }
  return element
}