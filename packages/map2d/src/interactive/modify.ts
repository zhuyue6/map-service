import OlCollection from 'ol/Collection'
import OlFeature from 'ol/Feature'
import { syncOlFeatureElementData } from '../container/elements'
import { Element } from '../container/elements/element'
import OlModify from 'ol/interaction/Modify';
import { Interactive } from './types'
import { type InteractiveManager, getId} from './interactiveManager'

export type ModifyInteractive = Interactive<{
  add(element: Element): void 
  remove(element: Element): void
  clean(): void
}>

export type Emit = Element[]

export function createInteractive(interactiveManager: InteractiveManager, useSync=true) {
  let interactive: ModifyInteractive  =  interactiveManager.getInteractiveByType('modify') as ModifyInteractive
  if (interactive) {
    return interactive
  }
  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const container = interactiveManager.getContainer()

  const olCollection = new OlCollection<OlFeature>([])
  const olModify = new OlModify({
    features: olCollection
  })

  let list: Element[] = []

  olModify.on('modifyend', (evt) => {
    const olFeatureList: OlFeature[]  = evt.features.getArray() ?? []
    if (useSync) {
      // 是否同步
      olFeatureList.forEach((item) => {
        syncOlFeatureElementData(item, container)
      })
    }
    emitter.emit('element:modify', list)
  });

  interactive = {
    id: getId(),
    type: 'modify',
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
      olMap.addInteraction(olModify);
      interactive.enabled = true
    },
    close() {
      if (!interactive.enabled) return 
      olMap.removeInteraction(olModify);
      interactive.enabled = false
    },
    destroy() {
      interactive.clean()
      interactive.close()
      olModify.dispose()
    }
  }
  return interactive
}