import { App, Plugin } from '../types'

function calculatePowerRelation(range: [number, number]) {
  const [num, power] = range;
  
  // 处理特殊情况
  if (num <= 0) {
    return [0, 1]; // 0乘以任何数仍为0，小于1
  }
  
  // 将数字表示为2的幂次方：num = 2^x
  const x = Math.log2(num);
  
  // 计算新的指数：x + power
  const newPower = x + power;
  
  // 判断2^newPower与1的关系
  let relation;
  if (2 ** newPower > 1) {
    relation = 3; // 大于1
  } else if (2 ** newPower === 1) {
    relation = 2; // 等于1
  } else {
    relation = 1; // 小于1
  }
  
  return [x, relation];
}

let range = [0.25, 8]
let scale = 1
function makeTool(app: App) {
  const { view, baseMap } = app
  const extent = baseMap.getExtent()
  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return 
      tool.enabled = true
    },
    setView(data: [number, number]) {
      if (!tool.enabled) return
      range = calculatePowerRelation(data)
      const [min, max] = range
      const zoom = view.getZoom()
      view.setMaxZoom(zoom! + max)
      view.setMinZoom(zoom! + min)
      app.emitter.emit('scale', {
        scale,
        range
      })
    },
    fit(data: number) {
      if (!tool.enabled) return
      scale = data
      const length = extent[3] - extent[0]
      const distanceX = (length - length / scale) / 2
      const topLeftX = distanceX
      const topLeftY = distanceX
      const LowerRightX  = distanceX + length / scale
      const LowerRightY = distanceX + length / scale
      view.fit([topLeftX, topLeftY, LowerRightX, LowerRightY])
      app.emitter.emit('scale', {
        scale,
        range
      })
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
    type: 'scale',
    install(_app: App) {
      app = _app
      app.tools.scale = makeTool(app)
      return app
    }
  }
  return plugin
}

declare module './tool' {
  interface Tools {
    scale: ReturnType<typeof makeTool>
  }
}

declare module '../types' {
  interface AppEmitterEvent {
    scale: any
  }
}