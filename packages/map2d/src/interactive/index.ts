import OlMap from 'ol/Map'
import { type Container } from '../container'
import { createModifyInteractive, EventType as ModifyEventType } from './modify'
import { createSelectInteractive, EventType as SelectEventType } from './select'
import { createMeasureInteractive, EventType as MeasureEventType } from './measure'
import { createDrawInteractive, type DrawInteractiveOptions, EventType as DrawEventType } from './draw'
import { createMoveInteractive, EventType as MoveEventType } from './move'
import { InteractiveEvent } from './types'
import { emitter } from '../events'

export interface InteractiveItem<E=string> extends InteractiveEvent {
    id: number
    type: keyof InteractiveCreaterMap
    emitter: emitter.Emitter<E>
}

interface InteractiveOptions<T extends keyof InteractiveCreaterMap> {
  type: T,
  options?: DrawInteractiveOptions
}

export interface Interactive {
  create<T extends keyof InteractiveCreaterMap>(options: InteractiveOptions<T>): ReturnType<typeof createInteractiveItem<T>>
  add(interactive: InteractiveItem): void
  close(interactive: InteractiveItem): void
  clean(): void
  plugins: InteractivePlugins
  getInteractiveItems(): InteractiveItem[]
}

let id = 0;

type InteractivePlugins = {
  [key in keyof InteractiveCreaterMap]: ReturnType<typeof createInteractiveItem<key>>
}

export function createInteractive(olMap: OlMap, container: Container): Interactive {
  let interactivesItems: InteractiveItem[] = []
 
  const interactive: Partial<Interactive> = {
    create(options) {
      const interactiveItem = createInteractiveItem(olMap, container, options.type, options.options)
      interactive.add(interactiveItem)
      return interactiveItem
    },
    add(interactiveItem: InteractiveItem) {
      if (!interactiveItem) return
      const interactiveItemMatcher = interactivesItems.findIndex((item) => item.id === interactiveItem.id)
      if (interactiveItemMatcher !== -1) return
      interactivesItems.push(interactiveItem)
    },
    close(interactiveItem: InteractiveItem) {
      if (!interactiveItem) return
      const interactiveItemMatcher = interactivesItems.findIndex((item) => item.id === interactiveItem.id)
      if (interactiveItemMatcher === -1) return
      interactiveItem.close()
      interactivesItems.splice(interactiveItemMatcher, 1)
    },
    clean(){
      for (const interactiveItem of interactivesItems) {
        interactiveItem.close()
      }
      interactivesItems = []
    },
    getInteractiveItems() {
      return interactivesItems
    }
  }

  interactive.plugins = useInteractivePlugins(interactive as Interactive)
  
  return interactive as Interactive
}

/**
 * 在交换上添加基础插件交互包括移动、绘制、修改、选择、测距、测面积
 * @param interactive 
 * @returns 
 */
function useInteractivePlugins(interactive: Interactive): InteractivePlugins {
  const plugins: InteractivePlugins = {
    move: interactive.create({
      type: 'move',
    }),
    draw: interactive.create({
      type: 'draw',
      options: {
        type: 'rect'
      }
    }),
    modify: interactive.create({
      type: 'modify'
    }),
    select: interactive.create({
      type: 'select'
    }),
    distance: interactive.create({
      type: 'distance'
    }),
    area: interactive.create({
      type: 'area'
    })
  }
  return plugins
}

type InteractiveCreaterOptions = {
  olMap: OlMap
  emitter: emitter.Emitter
}

// 交互创建器与交互项目的映射类型、包括交互参数、事件、交互实例
interface InteractiveCreaterMap {
  move: {
    options: InteractiveCreaterOptions & {
      container: Container
    },
    emitter: MoveEventType
    instance: ReturnType<typeof createMoveInteractive>
  },
  draw: {
    options: InteractiveCreaterOptions & {
      options: DrawInteractiveOptions
    },
    emitter: DrawEventType
    instance: ReturnType<typeof createDrawInteractive>
  },
  select: {
    options: InteractiveCreaterOptions & {
      container: Container
    },
    emitter: SelectEventType
    instance: ReturnType<typeof createSelectInteractive>
  },
  modify: {
    options: InteractiveCreaterOptions & {
      container: Container
    },
    emitter: ModifyEventType
    instance: ReturnType<typeof createModifyInteractive>
  },
  distance: {
    options: InteractiveCreaterOptions,
    emitter: MeasureEventType
    instance: ReturnType<typeof createMeasureInteractive>
  },
  area: {
    options: InteractiveCreaterOptions,
    emitter: MeasureEventType
    instance: ReturnType<typeof createMeasureInteractive>
  }
}


const interactiveCreater = {
  move: (options: InteractiveCreaterMap['move']['options']) => createMoveInteractive(options.olMap, options.emitter, options.container),
  draw: (options: InteractiveCreaterMap['draw']['options']) => createDrawInteractive(options.olMap, options.emitter, options.options),
  select: (options: InteractiveCreaterMap['select']['options']) => createSelectInteractive(options.olMap, options.emitter, options.container),
  modify: (options: InteractiveCreaterMap['modify']['options']) => createModifyInteractive(options.olMap, options.emitter, options.container),
  distance: (options: InteractiveCreaterMap['distance']['options']) => createMeasureInteractive(options.olMap, 'distance', options.emitter),
  area: (options: InteractiveCreaterMap['area']['options']) => createMeasureInteractive(options.olMap, 'area', options.emitter)
}

function createInteractiveItem<T extends keyof InteractiveCreaterMap>(olMap: OlMap, container: Container, type: T, options?: any) {
  const interactiveEmitter = emitter.createEmitter()
  const interactiveEvent = interactiveCreater[type]({ olMap, emitter: interactiveEmitter, options, container })
  const interactive: InteractiveItem<InteractiveCreaterMap[T]['emitter']> & InteractiveCreaterMap[T]['instance'] = { 
    id, 
    type,
    emitter: interactiveEmitter,
    ...interactiveEvent
  }
  id++;
  return interactive
}