import OlMap from 'ol/Map'
import OlCollection from 'ol/Collection'
import OlTranslate from 'ol/interaction/Translate'
import OlFeature from 'ol/Feature'
import { Element, syncFeatureElementData } from '../container/elements'
import { InteractiveEvent } from './types'
import { emitter } from '../events'
import { type Container } from '../container'


export interface ElementInteractiveEvent extends InteractiveEvent {
  add(element: Element): void
  remove(element: Element): void
  clean(): void
}

export type EventType = 'move' | keyof ElementInteractiveEvent

export function createMoveInteractive(olMap: OlMap, emitter: emitter.Emitter, container: Container): ElementInteractiveEvent {
  let list: Element[] = []
  const olCollection = new OlCollection<OlFeature>([])
  const olTranslate = new OlTranslate({
    features: olCollection
  })

  olTranslate.on('translateend', (evt) => {
    const translateList: OlFeature[]  = evt.features.getArray() ?? []
    translateList.forEach((item) => {
      syncFeatureElementData(item, container)
    })
    
    emitter.emit('move', list)
  });

  const elementInteractive: ElementInteractiveEvent = {
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
      emitter.emit('clean')
    },
    enable() {
      olMap.addInteraction(olTranslate);
      emitter.emit('enable')
    },
    close() {
      olMap.removeInteraction(olTranslate);
      emitter.emit('close')
    }
  }
  return elementInteractive
}