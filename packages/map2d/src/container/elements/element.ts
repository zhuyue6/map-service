import type { BaseElement, ElementExtend } from './types'
import { createElement as createCircleElement, type CirclePluginOptions } from './circle'
import { createElement as createPolygonElement, type PolygonPluginOptions } from './polygon'
import { createElement as createLineElement, type LinePluginOptions } from './line'
import { createElement as createImageElement, type ImagePluginOptions } from './image'

let id: number = 0;

export interface ElementPluginsMap {
  line: {
    options: LinePluginOptions,
  }
  circle: {
    options: CirclePluginOptions,
  }
  polygon: {
    options: PolygonPluginOptions,
  }
  rect: {
    options: PolygonPluginOptions,
  },
  image: {
    options: ImagePluginOptions,
  }
}

export interface Element<T extends ElementType = any> extends BaseElement<T extends ElementType ? ElementPluginsMap[T]['options']['data'] : any> {
  type: ElementType
}

export type ElementType = keyof ElementPluginsMap

const elementPlugins = {
  line: (options: ElementPluginsMap['line']['options']) => createLineElement(options),
  circle: (options: ElementPluginsMap['circle']['options']) => createCircleElement(options),
  polygon: (options: ElementPluginsMap['polygon']['options']) => createPolygonElement(options),
  rect: (options: ElementPluginsMap['rect']['options']) => createPolygonElement(options),
  image: (options: ElementPluginsMap['image']['options']) => createImageElement(options)
}

export function createElement<T extends ElementType>(options: Omit<ElementPluginsMap[T]['options'], keyof ElementExtend> & {
  type: T
}, layerId: number) {
  id++
  const element = elementPlugins[options.type]({
    ...options,
    id,
    layerId,
  } as any)

  element.setProps({
    elementId: id,
    layerId: layerId
  })

  return element
}
