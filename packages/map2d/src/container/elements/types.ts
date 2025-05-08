import { Style } from "../../style"
import OlFeature from 'ol/Feature'

export interface BaseElementOptions<D = any> {
  type: string
  name?: string
  data: D
  style?: Style
}

export interface BaseElement<D> extends BaseElementOptions<D>{
  layerId: number
  id: number
  getOlFeature(): OlFeature
}

export interface CircleData {
  center: number[],
  radius: number
}

export type PointData = Array<[number, number]>