import { type Element as SElement, type ElementData, type Style, ElementType as SElementType }  from '@web-map-service/map2d'

export {
  type SElement
}

export interface ElementOptions {
  id?: number
  type: string
  name?: string
  style?: Style
  rotate?: number
  sElementType?: SElementType
  data: ElementData
}

export type CreateElementOption = Omit<ElementOptions, 'type'>

export interface Element {
  id: number
  type: string
  name?: string
  rotate?: number
  props?: SElement['props'],
  setProps: SElement['setProps']
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
  name?: string
  sElementType: SElementType[],
  create(options: CreateElementOption): Element,
  add(element: Element): void
  remove(element: Element): void,
  getElements(): Element[]
  getElementById(id: number): Element | undefined
}

export interface ElementPlugin {
  create(options: ElementOptions): Element | undefined
  add(elements: Element | Element[]): void
  remove(elements: Element | Element[]): void
  addLayer(layer: Layer): void
  removeLayer(layer: Layer): void
  getLayers(): Layer[]
  getLayerByType(type: string): Layer | undefined
  getLayerById(id: number): Layer | undefined
}

export type ElementPluginExtend = {
  element: ElementPlugin
}