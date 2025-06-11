import { App, Plugin } from '../types'
import { elements } from '@web-map-service/map2d-app'
import { setElementsData, Element } from '../elements'
import { util } from '../shared'

function getElementExtreme(type: RankType, element: Element) {
  const sElement = element.getSElement()
  let elementExtreme;
  if (sElement.type === 'circle') {
    // 圆形
    // 间距
    const distance = (sElement as elements.SElement<'circle'>)['data'].radius
    // 是否使用当前元素的极限值替换最终极限值
    if (type === 'left') {
      elementExtreme = (sElement as elements.SElement<'circle'>)['data'].center[0] - distance;
    }
    if (type === 'right') {
      elementExtreme = (sElement as elements.SElement<'circle'>)['data'].center[0] + distance;
    }
    if (type === 'top') {
      elementExtreme = (sElement as elements.SElement<'circle'>)['data'].center[1] + distance;
    }
    if (type === 'bottom') {
      elementExtreme = (sElement as elements.SElement<'circle'>)['data'].center[1] - distance;
    }
  } else {
    // 多边形、线段
    for (const coord of sElement['data']) {
      // 是否使用当前元素的极限值替换最终极限值
      if (type === 'left' || type === 'right') {
        if (util.isUnDef(elementExtreme)) {
          elementExtreme = coord[0];
          continue
        }
        if (type === 'left') {
          elementExtreme = elementExtreme < coord[0] ? elementExtreme : coord[0];
          continue
        }
        if (type === 'right') {
          elementExtreme = elementExtreme > coord[0] ? elementExtreme : coord[0];
          continue
        }
      }
      if (type === 'top' || type === 'bottom') {
        if (util.isUnDef(elementExtreme)) {
          elementExtreme = coord[1];
          continue
        }
        if (type === 'top') {
          elementExtreme = elementExtreme > coord[1] ? elementExtreme : coord[1];
          continue
        }
        if (type === 'bottom') {
          elementExtreme = elementExtreme < coord[1] ? elementExtreme : coord[1];
          continue
        }
      }
    }
  }
  return elementExtreme
}

function getExtreme(type: RankType, elements: Element[]) {
  // 找出极限值
  let extreme: number | undefined = undefined
  for (const element of elements) {
    let useSElementExtreme = false
    const elementExtreme = getElementExtreme(type, element)

    // extreme 不存在直接赋值
    if (util.isUnDef(extreme)) {
      extreme = elementExtreme
      continue
    }

    if (type === 'left') {
      useSElementExtreme = extreme > elementExtreme
    }
    if (type === 'right') {
      useSElementExtreme = extreme < elementExtreme
    }
    if (type === 'top') {
      useSElementExtreme = extreme < elementExtreme
    }
    if (type === 'bottom') {
      useSElementExtreme = extreme > elementExtreme
    }
    
    if (!useSElementExtreme) continue
    extreme = elementExtreme
  }
  return extreme!
}

function syncElements(type: RankType, app: App, extreme: number, elements: Element[]) {
  // 所有元素极限排列

  const elementsSetDataItems: Parameters<typeof setElementsData>['0'] = []

  for (const element of elements) {
    const sElement = element.getSElement()
    const elementExtreme = getElementExtreme(type, element)
    // 计算需要移动的大小
    const distance = extreme - elementExtreme
    let data: Element['data'] = []
    if (sElement.type === 'circle') {
      // 圆形
      let x: number | undefined = undefined
      let y: number | undefined = undefined
      if (type === 'left' || type === 'right') {
        x = sElement.data.center[0] + distance
        y = sElement.data.center[1]
      }

      if (type === 'top' || type === 'bottom') {
        x = sElement.data.center[0]
        y = sElement.data.center[1] + distance
      }


      if (type === 'centerX') {
        x = extreme
        y = sElement.data.center[1]
      }

      if (type === 'centerY') {
        x = sElement.data.center[0]
        y = extreme
      }

      data = {
        radius: sElement.data.radius,
        center: [x!, y!]
      }
    } else {
      // 多边形、线段
      data = []
      if (type === 'left' || type === 'right') {
        for (const coord of sElement.data) {
          data.push([coord[0] + distance, coord[1]])
        }
      }

      if (type === 'top' || type === 'bottom') {
        for (const coord of sElement.data) {
          data.push([coord[0], coord[1] + distance])
        }
      }

      if (type === 'centerX') {
        const leftElementExtreme = getElementExtreme('left', element)
        const rightElementExtreme = getElementExtreme('right', element)
        const distance = (rightElementExtreme + leftElementExtreme) / 2 - extreme
        for (const coord of sElement.data) {
          data.push([coord[0] - distance, coord[1]])
        }
      }

      if (type === 'centerY') {
        const topElementExtreme = getElementExtreme('top', element)
        const bottomElementExtreme = getElementExtreme('bottom', element)
        const distance = (topElementExtreme + bottomElementExtreme) / 2 - extreme
        for (const coord of sElement.data) {
          data.push([coord[0], coord[1] - distance])
        }
      }
    }

    elementsSetDataItems.push({
      element,
      data: {
        data
      }
    })
  }

  setElementsData(elementsSetDataItems, app.emitter)

  app.emitter.emit('rank', {
    elements,
    type,
    extreme
  })
}

function leftAlign(app: App, elements: Element[]) {
  const extreme: number = getExtreme('left', elements)
  syncElements('left', app, extreme, elements)
}

function rightAlign(app: App, elements: Element[]) {
  const extreme: number = getExtreme('right', elements)
  syncElements('right', app, extreme, elements)
}

function topAligin(app: App, elements: Element[]) {
  const extreme: number = getExtreme('top', elements)
  syncElements('top', app, extreme, elements)
}

function bottomAligin(app: App, elements: Element[]) {
  const extreme: number = getExtreme('bottom', elements)
  syncElements('bottom', app, extreme, elements)
}

function centerAliginX(app: App, elements: Element[]) {
  const leftExtreme: number = getExtreme('left', elements)
  const rightExtreme: number = getExtreme('right', elements)
  const extreme = (leftExtreme + rightExtreme) / 2
  syncElements('centerX', app, extreme, elements)
}

function centerAliginY(app: App, elements: Element[]) {
  const topExtreme: number = getExtreme('top', elements)
  const bottomExtreme: number = getExtreme('bottom', elements)
  const extreme = (topExtreme + bottomExtreme) / 2
  syncElements('centerY', app, extreme, elements)
}

type RankType = 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY'

function makeTool(app: App) {
  const select = app.tools.select;

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
    },
    use(type: RankType) {
      if (!tool.enabled) return 
      const elements = select.getSelected()
      // 小于2个元素不进行排列
      if (elements.length < 2) return
      if (type === 'left') {
        leftAlign(app, elements)
        return
      }
      if (type === 'right') {
        rightAlign(app, elements)
        return
      }
      if (type === 'centerX') {
        centerAliginX(app, elements)
        return
      }
      if (type === 'centerY') {
        centerAliginY(app, elements)
        return
      }
      if (type === 'top') {
        topAligin(app, elements)
        return
      }
      if (type === 'bottom') {
        bottomAligin(app, elements)
        return
      }
    },
    close() {
      if (!tool.enabled) return 
      tool.enabled = false
    }
  }
  return tool
}

export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'rank',
    depend: ['select'],
    install(_app: App) {
      app = _app
      app.tools.rank = makeTool(app)
      return app
    },
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    rank: ReturnType<typeof makeTool>
  }
}

declare module '../types' {
  interface AppEmitterEvent {
    rank: any
  }
}