import OlVectorSource from 'ol/source/Vector';
import { Vector as OlVectorLayer } from 'ol/layer';
import OlDraw, { createBox as OlCreateBox, type GeometryFunction } from 'ol/interaction/Draw';
import { Interactive } from './types'
import { getElementData, ElementData } from '../container/elements'
import { getId, InteractiveManager } from './interactiveManager'
import { getStyle } from '../style'

export type DrawType = 'line' | 'circle' | 'polygon' | 'rect'

const strokeColor = '#979797'
const fillColor = '#F3F3F3'

export interface DrawInteractiveOptions {
  type: DrawType
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

export interface Emit {
  type: DrawType,
  data: ElementData
}

export type DrawInteractive = Interactive<{
  use(type: DrawInteractiveOptions['type']): void
  clean(): void
}> 

export function createInteractive(interactiveManager: InteractiveManager, options?: DrawInteractiveOptions) {
  let interactive: DrawInteractive =  interactiveManager.getInteractiveByType('draw') as DrawInteractive
  if (interactive) {
    return interactive
  }
  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const olSource: OlVectorSource = new OlVectorSource()
  const olLayer: OlVectorLayer = new OlVectorLayer({
    source: olSource,
  })
  let olDraw: OlDraw
  let type = options?.type ?? 'line'
  const geometryFunction = options?.type ? geometryFunctionMap[options.type] : undefined

  function createDraw(type: DrawInteractiveOptions['type'], geometryFunction?: GeometryFunction) {
    olDraw = new OlDraw({
      source: olSource,
      type: InteractiveType[type],
      style: getStyle({
        stroke: {
          width: 2,
          color: strokeColor
        },
        fill: {
          color: fillColor
        },
        circle: {
          radius: 4,
          stroke: {
            color: strokeColor,
            width: 3
          },
          fill: {
            color: '#fff'
          }
        }
      }),
      geometryFunction
    })
    olDraw.on('drawend', (evt) => {
      const olGeometry = evt.feature.getGeometry()
      const drawData = getElementData(olGeometry!)
      setTimeout(()=>{
        olSource.clear()
      })
      emitter.emit('draw', {
        type,
        data: drawData
      })
    })
  }

  createDraw(type, geometryFunction)

  interactive = {
    id: getId(),
    type: 'draw',
    enabled: false,
    use(useType: DrawInteractiveOptions['type']) {
      type = useType
      olMap.removeInteraction(olDraw);
      const geometryFunction = geometryFunctionMap[type]
      createDraw(type, geometryFunction)
      if (interactive.enabled) {
        // 如果已经启用绘制则重新添加交互项
        olMap.addInteraction(olDraw);
      }
      emitter.emit('use')
    },
    enable() {
      if (interactive.enabled) return 
      olMap.addLayer(olLayer)
      olMap.addInteraction(olDraw);
      interactive.enabled = true
    },
    close() {
      if (!interactive.enabled) return 
      interactive.clean()
      olMap.removeLayer(olLayer)
      olMap.removeInteraction(olDraw);
      interactive.enabled = false
    },
    clean() {
      olSource.clear()
    },
    destroy() {
      interactive.close()
      olLayer.dispose()
      olDraw.dispose()
    }
  }

  interactiveManager.add(interactive)
  return interactive
}