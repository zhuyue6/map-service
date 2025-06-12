import { emitter } from '../events'
import { Interactive } from './types'
import OlMap from 'ol/Map'
import { Container } from '../container'

export interface InteractiveManager {
  add(interactive: Interactive): void
  remove(interactive: Interactive): void
  clean(): void
  getOlMap(): OlMap
  getContainer(): Container
  getEmitter(): emitter.Emitter
  getInteractiveByType(type: string): Interactive | undefined
  getInteractives(): Interactive[]
}


let id = 0;
export function getId() {
  id++
  return id
}

export function createInteractiveManager(olMap: OlMap, container: Container, emitter: emitter.Emitter): InteractiveManager {
  const interactives: Interactive[] = []
  const interactiveManager: InteractiveManager = {
    add(interactive: Interactive) {
      if (!interactive) return
      const interactiveItemMatcher = interactives.findIndex((item) => item.id === interactive.id)
      if (interactiveItemMatcher !== -1) return
      interactives.push(interactive)
    },
    remove(interactive: Interactive) {
      if (!interactive) return
      const interactiveItemMatcher = interactives.findIndex((item) => item.id === interactive.id)
      if (interactiveItemMatcher === -1) return
      interactive.destroy()
      interactives.splice(interactiveItemMatcher, 1)
    },
    clean(){
      for (const interactive of interactives) {
        interactiveManager.remove(interactive)
      }
    },
    getInteractiveByType(type: string) {
      return interactives.find((item) => item.type === type)
    },
    getInteractives() {
      return interactives
    },
    getOlMap() {
      return olMap
    },
    getContainer() {
      return container
    },
    getEmitter() {
      return emitter
    },
  }
  
  return interactiveManager as InteractiveManager
}