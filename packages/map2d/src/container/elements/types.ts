import type { Style } from "../../style"
import OlFeature from 'ol/Feature'

export interface ElementImage {
  src: string
}
export interface BaseElementOptions<D = any> {
  type: string
  name?: string
  image?: ElementImage
  rotate?: number
  data: D
  style?: Style
}

export interface BaseElement<D> extends BaseElementOptions<D>{
  layerId: number
  id: number
  props: Record<string, unknown>
  setRotate(rotate: number): void
  setData(data: D): void
  setStyle(style: Style): void
  setProps(props: Record<string, unknown>): void
  setName(name: string): void
  getOlFeature(): OlFeature
  [key: string]: unknown
}

export interface ElementExtend {
  layerId: number
  id: number
}
export interface ElementPluginOptions<T=any> extends BaseElementOptions<T>, ElementExtend {

}

export type Coord = [number, number]

export interface CircleData {
  center: Coord,
  radius: number
}

export type PointData = Array<Coord>
