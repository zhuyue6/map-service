import 'ol/ol.css'
import OlMap from 'ol/Map';
import { createInteractive, Interactive } from './interactive'
import { createContainer, Container, BaseMapOptions } from './container'
import { createRenderer, Renderer } from './renderer'
import { createView, View, ViewOptions } from './view'
import { lifecycle } from './lifecycle'

interface Map2D {
  container: Container
  renderer: Renderer
  view: View
  interactive: Interactive
}

interface Map2DOptions {
  mounted?: () => void
  updated?: () => void
  unMounted?: () => void
  el: HTMLElement | string,
  baseMap?: BaseMapOptions,
  view?: ViewOptions
}


/**
 * 
 * @param options Map2DOptions
 * @returns Map2D 目前包含container、 renderer、view、 interactive 四大模块
 */
export function createMap(options: Map2DOptions) {
  const lifecycleEmitter = lifecycle(options)
  const olMap = new OlMap({
    target: options.el,
    controls: []
  })
  const container = createContainer(olMap, options.baseMap)

  // 这里interactive注入container是为了交互事件中的olFeature映射到element
  const interactive = createInteractive(olMap, container)

  // container中baseMap与view结合
  const view: View = createView(olMap, container, options.view)
  const renderer = createRenderer(olMap, lifecycleEmitter)

  const map2D: Map2D = {
    container,
    renderer,
    view,
    interactive,
  }

  lifecycleEmitter.emit('mountedHook')
  return map2D
}