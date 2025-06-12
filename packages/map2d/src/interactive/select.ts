import OlSelect from 'ol/interaction/Select'
import OlDragBox from 'ol/interaction/DragBox'
import OlCollection from 'ol/Collection'
import OlFeature from 'ol/Feature'
import { click as OlClick } from 'ol/events/condition'
import { getStyle } from '../style'
import { Interactive } from './types'
import { type InteractiveManager, getId } from './interactiveManager'
import { getElementByOlFeature } from '../container/elements'
import { Element } from '../container/elements/element'
import { getElementOlStyle } from '../container/elements/common'
import OlVectorSource from 'ol/source/Vector'
import { platformModifierKeyOnly } from 'ol/events/condition';
import { strokeColor, fillColor } from '../style'
import { util } from '../shared'

const strokeWidth = 2
export type Emit = Element[]

export type SelectInteractive = Interactive<{
  add(element: Element): void
  remove(element: Element): void
  clean(): void
}> 

export function createInteractive(interactiveManager: InteractiveManager): SelectInteractive {
  let interactive: SelectInteractive =  interactiveManager.getInteractiveByType('select') as SelectInteractive
  if (interactive) {
    return interactive
  }

  const selectedFeatures: OlCollection<OlFeature> = new OlCollection();

  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const container = interactiveManager.getContainer()
  const olSelect: OlSelect = new OlSelect({
    condition: OlClick,
    multi: true,
    style(feature) {
      const element = getElementByOlFeature(feature as OlFeature, container)
      if (!element) return
      const style = getElementOlStyle(element)
      return [...style, getStyle({
        stroke: {
          color: strokeColor,
          width: strokeWidth
        },
      })]
    },
    features: selectedFeatures
  });
  
  const olDragBox = new OlDragBox({
    condition: platformModifierKeyOnly,
    className: 'map2d-select_olDragBox',
  })

  util.safeInsertCssRule(`.map2d-select_olDragBox {
    border: 2px solid ${strokeColor};
    background-color: ${fillColor};
  }`)

  olSelect.on('select', function (e) {
    const featureList: OlFeature[] = e.target.getFeatures().getArray() ?? []
    const list: Element[] = []
    featureList.forEach((item) => {
      const element = getElementByOlFeature(item, container)
      if (element) list.push(element)
    })
    emitter.emit('element:select', list)
  });

  olDragBox.on('boxend', () => {
    const extent = olDragBox.getGeometry().getExtent();
    const layers = container.layerManager.getLayers()
    selectedFeatures.clear()
    for (const layer of layers) {
      const olLayer = layer.getOlLayer();
      (olLayer.getSource() as OlVectorSource).forEachFeatureIntersectingExtent(extent, (olFeature)=>{
        selectedFeatures.push(olFeature);
      })
    }
    activeSelectEvent()
  })

  function activeSelectEvent() {
    olSelect.dispatchEvent({
      type: 'select',
      selected: selectedFeatures,
      deselected: [],
      mapBrowserEvent: null
    } as any)
  }


  interactive = {
    id: getId(),
    type: 'select',
    enabled: false,
    enable() {
      if (interactive.enabled) return 
      olMap.addInteraction(olSelect)
      olMap.addInteraction(olDragBox)
      interactive.enabled = true
    },
    add(element: Element) {
      selectedFeatures.push(element.getOlFeature())
      activeSelectEvent()
    },
    remove(element: Element) {
      selectedFeatures.remove(element.getOlFeature())
      activeSelectEvent()
    },
    clean() {
      selectedFeatures.clear()
      activeSelectEvent()
    },
    close() {
      if (!interactive.enabled) return 
      olMap.removeInteraction(olSelect)
      olMap.removeInteraction(olDragBox)
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