import OlFeature from 'ol/Feature'
import * as OlStyle from "ol/style"

export const strokeColor = '#44D7B6';
export const strokeWidth = 1
export const fillColor = '#44D7B61A'
export const imageWidth = 40
export const imageHeight = 40

interface StorkeStyle {
  color: string,
  width: number
}

interface FillStyle {
  color: string
}

interface ImageStyle {
  src: string
}

interface CircleStyle {
  radius: number,
  stroke: Partial<StorkeStyle>
  fill: Partial<FillStyle>
}

export type Style = Partial<{
  stroke: Partial<StorkeStyle>
  fill: Partial<FillStyle>
  image: Partial<ImageStyle>
  circle: Partial<CircleStyle>
}>

export function setStyle(olFeature: OlFeature, options?: Partial<Style>) {
  const style = getStyle(options)
  olFeature.setStyle(style)
}

function getStorke(options?: Partial<StorkeStyle>) {
  const defaultStyle = {
    color: strokeColor,
    width: strokeWidth
  }
  const style = new OlStyle.Stroke({ ...defaultStyle, ...options })
  return style
}

function getCircle(options?: Partial<CircleStyle>) {
  if (!options) return
  const mergeStyle = {
    radius: options?.radius ?? 1,
    stroke: getStorke(options?.stroke),
    fill: getFill(options?.fill)
  }
  const style = new OlStyle.Circle(mergeStyle as any)
  return style
}

function getImage(options?: Partial<ImageStyle>) {
  if (!options) return
  const defaultStyle = {
    width: imageWidth,
    height: imageHeight
  }
  const style = new OlStyle.Icon({ 
    ...defaultStyle, 
    ...options, 
    crossOrigin: 'anonymous'
  })
  return style
}

function getFill(options?: Partial<StorkeStyle>) {
  const defaultStyle = {
    color: fillColor,
  }
  const style = new OlStyle.Fill({ ...defaultStyle, ...options })
  return style
}

export function getStyle(options?: Partial<Style>) {
  const olFill = getFill(options?.fill)
  const olStroke = getStorke(options?.stroke)
  const olImage = options?.circle ? getCircle(options?.circle) : getImage(options?.image)
  const style = new OlStyle.Style({
    fill: olFill,
    stroke: olStroke,
    image: olImage
  })
  return style
}