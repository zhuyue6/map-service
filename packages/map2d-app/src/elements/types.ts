import { type Element as SElement, type ElementData, type Style }  from '@web-map-service/map2d'

export interface ElementOptions {
  id?: number
  type: string
  name?: string
  style?: Style
  rotate?: number
  data: ElementData
}

export type CreateElementOption = Omit<ElementOptions, 'type'>


export interface Element {
  id: number
  type: string
  name?: string
  rotate?: number
  setName(name: string): void
  setRotate(rotate: number): void
  getSElement(): SElement
  style?: Style
  setStyle(style: Style): void
  data: ElementData
  setData(data: ElementData): void
}


export interface Layer {
  id: number
  type: string
  sElementType: string,
  create(options: CreateElementOption): Element,
  add(element: Element): void
  remove(element: Element): void,
  getElements(): Element[]
  getElementById(id: number): Element | undefined
}

export interface ElementPlugin {
  create(options: ElementOptions): Element | undefined
  add(element: Element): void
  remove(element: Element): void
  addLayer(layer: Layer): void
  removeLayer(layer: Layer): void
  getLayers(): Layer[]
  getLayerByType(type: string): Layer | undefined
  getLayerById(id: number): Layer | undefined
}

export type ElementPluginExtend = {
  element: ElementPlugin
}