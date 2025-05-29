import 'ol/ol.css'
import OlMap from 'ol/Map';
import { createInteractiveManager, type InteractiveManager } from './interactive'
import { createContainer, type Container, type BaseMapOptions} from './container'
import { createRenderer, type Renderer } from './renderer'
import { createView, type View, type ViewOptions } from './view'
import { lifecycle } from './lifecycle'
import  * as events from './events'
import { Style } from './style'
import { createTools, Tools } from './tools'

export {
  events
}

export { 
  createDrawInteractive,
  createMeasureInteractive,
  createModifyInteractive,
  createMoveInteractive,
  createSelectInteractive,
  type DrawType,
  type DrawEmit,
  type MoveEmit,
  type ModifyEmit,
  type MeasureEmit,
  type SelectEmit,
  type InteractiveManager,
  type Interactive,
  type InteractiveEvent
} from './interactive'

export { 
  getElementData,
  type BaseMap, 
  type BaseMapOptions, 
  type Layer, 
  type LayerManager, 
  type Element,
  type ElementType,
  type CircleData,
  type PointData,
  type ElementData
} from './container'

export { 
  type View,
  type Renderer,
  type Style,
  type Tools
}

export interface Map2D {
  container: Container
  renderer: Renderer
  view: View
  emitter: events.emitter.Emitter
  interactiveManager: InteractiveManager
  tools: Tools
  destroy(): void
}

export interface Map2DOptions {
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
  const emitter = events.emitter.createEmitter()
  const olMap = new OlMap({
    target: options.el,
    controls: []
  })
  const container: Container = createContainer(olMap, emitter, options.baseMap)

  // 这里interactiveManager注入container是为了交互事件中的olFeature映射到element
  const interactiveManager = createInteractiveManager(olMap, container, emitter)

  // container中baseMap与view结合
  const view: View = createView(olMap, container, options.view)
  const renderer: Renderer = createRenderer(olMap, lifecycleEmitter)
  const tools: Tools = createTools(olMap)
  const map2D: Map2D = {
    container,
    renderer,
    view,
    interactiveManager,
    emitter,
    tools,
    destroy() {
      container.baseMap.clean()
      container.layerManager.clean()
      interactiveManager.clean()
      renderer.destroy()
    }
  }

  lifecycleEmitter.emit('mountedHook')
  return map2D
}