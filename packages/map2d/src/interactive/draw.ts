import OlMap from 'ol/Map'
import OlVectorSource from 'ol/source/Vector';
import { Vector as OlVectorLayer } from 'ol/layer';
import OlDraw, { createBox as OlCreateBox, type GeometryFunction } from 'ol/interaction/Draw';
import { InteractiveEvent } from './types'
import { emitter } from '../events';
import { getElementData, ElementType } from '../container/elements'

export interface DrawInteractiveOptions {
  type: ElementType
}

enum InteractiveType {
  line = 'LineString',
  circle = 'Circle',
  polygon = 'Polygon',
  rect = 'Circle'
}

const geometryFunctionMap: {
  [key: string]: GeometryFunction
} = {
  rect: OlCreateBox()
}

export type EventType = 'draw' | keyof DrawInteractiveEvent

export interface DrawInteractiveEvent extends InteractiveEvent {
  use(type: DrawInteractiveOptions['type']): void
}

export function createDrawInteractive(olMap: OlMap, emitter: emitter.Emitter, options?: DrawInteractiveOptions) {
  const olSource: OlVectorSource = new OlVectorSource()
  const olLayer: OlVectorLayer = new OlVectorLayer({
    source: olSource,
  })
  let olDraw: OlDraw
  let type = options?.type ?? 'line'
  const geometryFunction = options?.type ? geometryFunctionMap[options.type] : undefined
  const drawType = InteractiveType[type]

  function createDraw(drawType: `${InteractiveType}`, geometryFunction?: GeometryFunction) {
    olDraw = new OlDraw({
      source: olSource,
      type: drawType,
      geometryFunction
    })
    olDraw.on('drawend', (evt) => {
      const olGeometry = evt.feature.getGeometry()
      const drawData = getElementData(olGeometry!)
      emitter.emit('draw', {
        type,
        data: drawData
      })
    })
  }

  createDraw(drawType, geometryFunction)

  const interactive: DrawInteractiveEvent = {
    use(useType: DrawInteractiveOptions['type']) {
      type = useType
      olMap.removeInteraction(olDraw);
      const olDrawType = InteractiveType[type]
      const geometryFunction = geometryFunctionMap[type]
      createDraw(olDrawType, geometryFunction)
      olMap.addInteraction(olDraw);
      emitter.emit('use')
    },
    enable() {
      olMap.addLayer(olLayer)
      olMap.addInteraction(olDraw);
      emitter.emit('enable')
    },
    close() {
      olMap.removeLayer(olLayer)
      olMap.removeInteraction(olDraw);
      emitter.emit('close')
    }
  }
  return interactive
}