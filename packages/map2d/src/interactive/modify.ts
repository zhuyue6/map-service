import OlMap from 'ol/Map'
import OlCollection from 'ol/Collection'
import OlFeature from 'ol/Feature'
import { Element, syncFeatureElementData } from '../container/elements'
import OlModify from 'ol/interaction/Modify';
import { InteractiveEvent } from './types'
import { emitter } from '../events';
import { Container } from '../container';

export interface ModifyInteractiveEvent extends InteractiveEvent {
  add(element: Element): void 
  remove(element: Element): void
  clean(): void
}

export type EventType = 'modify' | keyof ModifyInteractiveEvent

export function createModifyInteractive(olMap: OlMap, emitter: emitter.Emitter, container: Container) {
  const olCollection = new OlCollection<OlFeature>([])
  const olModify = new OlModify({
    features: olCollection
  })

  let list: Element[] = []

  olModify.on('modifyend', (evt) => {
    const olFeatureList: OlFeature[]  = evt.features.getArray() ?? []
    olFeatureList.forEach((item) => {
      syncFeatureElementData(item, container)
    })
    emitter.emit('modify', list)
  });

  const interactive: ModifyInteractiveEvent = {
    add(element: Element) {
      const elementMatcher = list.findIndex((item) => item.id === element.id)
      if (elementMatcher !== -1) return 
      list.push(element)
      olCollection.push(element.getOlFeature())
      emitter.emit('add', element)
    },
    remove(element: Element) {
      const elementMatcher = list.findIndex((item) => item.id === element.id)
      if (elementMatcher === -1) return 
      list.splice(elementMatcher, 1)
      olCollection.remove(element.getOlFeature())
      emitter.emit('remove', element)
    },
    clean() {
      list = []
      olCollection.clear()
    },
    enable() {
      olMap.addInteraction(olModify);
      emitter.emit('enable')
    },
    close() {
      olMap.removeInteraction(olModify);
      emitter.emit('close')
    }
  }
  return interactive
}