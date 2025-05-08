import OlMap from 'ol/Map'
import OlSelect from 'ol/interaction/Select'
import OlFeature from 'ol/Feature'
import { click as OlClick } from 'ol/events/condition'
import { getStyle } from '../style'
import { InteractiveEvent } from './types'
import { emitter } from '../events'
import { type Container } from '../container'
import { Element, getElementByOlFeature } from '../container/elements'

const strokeColor = 'rgba(0, 0, 255, 0.7)'
const strokeWidth = 2

export type EventType = 'select' | keyof InteractiveEvent

export function createSelectInteractive(olMap: OlMap, emitter: emitter.Emitter, container: Container): InteractiveEvent {
  const olSelect: OlSelect = new OlSelect({
    condition: OlClick,
    style: getStyle({
      stroke: {
        color: strokeColor,
        width: strokeWidth
      },
    })
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

  const interactiveEvent: InteractiveEvent = {
    enable() {
      olMap.addInteraction(olSelect);
      emitter.emit('enable')
    },
    close() {
      olMap.removeInteraction(olSelect);
      emitter.emit('close')
    }
  }
  return interactiveEvent
}