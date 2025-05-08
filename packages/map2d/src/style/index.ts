import OlFeature from 'ol/Feature'
import * as OlStyle from "ol/style"

export const strokeColor = 'rgba(0, 255, 0, 0.6)';
export const strokeWidth = 1
export const fillColor = 'rgba(255, 0, 0, 0.6)'

interface StorkeStyle {
  color: string,
  width: number
}

interface FillStyle {
  color: string
}

export interface Style {
  stroke: StorkeStyle
  fill: FillStyle
}

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
  const style = new OlStyle.Style({
    fill: olFill,
    stroke: olStroke
  })
  return style
}