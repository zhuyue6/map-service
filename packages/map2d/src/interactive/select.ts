import OlSelect from 'ol/interaction/Select'
import OlFeature from 'ol/Feature'
import { click as OlClick } from 'ol/events/condition'
import { getStyle } from '../style'
import { Interactive } from './types'
import { type InteractiveManager, getId } from './interactiveManager'
import { getElementByOlFeature } from '../container/elements'
import { Element } from '../container/elements/element'
import { getElementOlStyle } from '../container/elements/common'

const strokeColor = 'rgba(0, 0, 255, 0.7)'
const strokeWidth = 2

export type Emit = Element[]

export function createInteractive(interactiveManager: InteractiveManager): Interactive {
  let interactive =  interactiveManager.getInteractiveByType('move')!
  if (interactive) {
    return interactive
  }
  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const container = interactiveManager.getContainer()
  const olSelect: OlSelect = new OlSelect({
    condition: OlClick,
    style(feature) {
      const element = getElementByOlFeature(feature as OlFeature, container)
      const style = getElementOlStyle(element!)
      return [...style, getStyle({
        stroke: {
          color: strokeColor,
          width: strokeWidth
        },
      })]
    }
  });
  
  olSelect.on('select', function (e) {
    const featureList: OlFeature[] = e.target.getFeatures().getArray() ?? []
    const list: Element[] = []
    featureList.forEach((item) => {
      const element = getElementByOlFeature(item, container)
      if (element) list.push(element)
    })
    emitter.emit('select', list)
  });

  interactive = {
    id: getId(),
    type: 'select',
    enabled: false,
    enable() {
      if (interactive.enabled) return 
      olMap.addInteraction(olSelect);
      interactive.enabled = true
    },
    close() {
      if (!interactive.enabled) return 
      olMap.removeInteraction(olSelect);
      interactive.enabled = false
    },
    destroy() {
      interactive.close()
      olSelect.dispose()
    }
  }
  interactiveManager.add(interactive)
  return interactive
}