import OlFeature from 'ol/Feature'
import * as OlStyle from "ol/style"

export const strokeColor = 'rgba(0, 255, 0, 0.6)';
export const strokeWidth = 1
export const fillColor = 'rgba(255, 0, 0, 0.6)'
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

export type Style = Partial<{
  stroke: Partial<StorkeStyle>
  fill: Partial<FillStyle>
  image: Partial<ImageStyle>
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
  const olImage = getImage(options?.image)
  const style = new OlStyle.Style({
    fill: olFill,
    stroke: olStroke,
    image: olImage
  })
  return style
}