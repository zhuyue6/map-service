import { Layer as OlLayer } from 'ol/layer'
import { default as OlVectorLayer } from 'ol/layer/Vector'
import { default as OlVectorSource } from "ol/source/Vector"
import { createElement, type ElementPluginsMap, Element } from './elements'

export interface Layer {
  id: number
  type?: string
  name?: string
  create<T extends keyof ElementPluginsMap>(options: ElementPluginsMap[T]['options'] & {
    type: T
  }): ReturnType<typeof createElement<T>>
  add(element: Element): void
  remove(element: Element): void
  clean(): void
  destroy(): void
  getElementById(elementId: number): Element | undefined
  getOlLayer(): OlLayer
  getElements(): Element[]
}

let id: number = 0

export interface LayerOptions {
  type?: string
  name?: string
}

/**
 * 图层负责元素创建、添加、移除、清空
 * 同时也能通过图层id来获取图层、getLayers获取当前全部图层
 */
export function createLayer(options?: LayerOptions): Layer {
  const olVectorSource = new OlVectorSource()
  const olLayer = new OlVectorLayer({
    source: olVectorSource
  })

  let elements: Element[] = []
  id++;
  const layer: Layer = {
    id,
    type: options?.type,
    name: options?.name,
    create<T extends keyof ElementPluginsMap>(options: ElementPluginsMap[T]['options'] & {
      type: T
    }) {
      const element = createElement(options, id)
      layer.add(element)
      return element
    },
    add(element: Element | null) {
      if (!element) return
      const elementMatcher = elements.findIndex((item) => item.id === element.id)
      if (elementMatcher !== -1) return 
      const olFeature = element.getOlFeature()
      olVectorSource.addFeature(olFeature)
      elements.push(element)
    },
    remove(element: Element) {
      if (!element) return
      const elementMatcher = elements.findIndex((item) => item.id === element.id)
      if (elementMatcher === -1) return 
      const olFeature = element.getOlFeature()
      olVectorSource.removeFeature(olFeature)
      elements.splice(elementMatcher, 1)
    },
    clean() {
      olVectorSource.clear()
      elements = []
    },
    destroy() {
      layer.clean()
      olLayer.dispose()
    },
    getOlLayer() {
      return olLayer
    },
    getElementById(id: number) {
      return elements.find((element) => id === element.id)
    },
    getElements() {
      return elements
    }
  }

  return layer
}