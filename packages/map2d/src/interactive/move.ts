import OlCollection from 'ol/Collection'
import OlTranslate from 'ol/interaction/Translate'
import OlFeature from 'ol/Feature'
import { syncOlFeatureElementData } from '../container/elements'
import { Element } from '../container/elements/element'
import { Interactive } from './types'
import { getId, InteractiveManager } from './interactiveManager'


export type MoveInteractive = Interactive<{
  add(element: Element): void
  remove(element: Element): void
  clean(): void
}> 

export type Emit = Element[]

export function createInteractive(interactiveManager: InteractiveManager, useSync=true): MoveInteractive {
  let interactive: MoveInteractive  =  interactiveManager.getInteractiveByType('move') as MoveInteractive
  if (interactive) {
    return interactive
  }
  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const container = interactiveManager.getContainer()

  let list: Element[] = []
  const olCollection = new OlCollection<OlFeature>([])
  const olTranslate = new OlTranslate({
    features: olCollection
  })

  olTranslate.on('translateend', (evt) => {
    const translateList: OlFeature[]  = evt.features.getArray() ?? []

    if (useSync) {
      // 是否同步
      translateList.forEach((item) => {
        syncOlFeatureElementData(item, container)
      })
    }
    
    emitter.emit('move', list)
  });

  interactive = {
    id: getId(),
    type: 'move',
    enabled: false,
    add(element: Element) {
      const elementMatcher = list.findIndex((item) => item.id === element.id)
      if (elementMatcher !== -1) return 
      list.push(element)
      olCollection.push(element.getOlFeature())
    },
    remove(element: Element) {
      const elementMatcher = list.findIndex((item) => item.id === element.id)
      if (elementMatcher === -1) return 
      list.splice(elementMatcher, 1)
      olCollection.remove(element.getOlFeature())
    },
    clean() {
      list = []
      olCollection.clear()
    },
    enable() {
      if (interactive.enabled) return 
      olMap.addInteraction(olTranslate);
      interactive.enabled = true
    },
    close() {
      if (!interactive.enabled) return 
      olMap.removeInteraction(olTranslate);
      interactive.enabled = false
    },
    destroy() {
      interactive.clean()
      interactive.close()
      olTranslate.dispose()
    }
  }
  interactiveManager.add(interactive)
  return interactive
}