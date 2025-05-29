import { createRenderer, Renderer } from './renderer'
import { createView, View } from './view'
import { createContainer, Container } from './container'
import { createPaths } from './container/path'
import { Lifecycle, lifecycle } from './lifecycle'
import { BaseMapOptions } from './container/baseMap'
import { mouse } from './events'

interface ZKMap {
  renderer: Renderer      // 渲染器
  container: Container    // 容器
  view: View              // 视口
  setRandomObjects: (nums: number) => void // 生产
  paths: {
    enable: boolean,
    data?: ReturnType<typeof createPaths> 
  },
  usePaths: (paths: [number, number][]) => void,
  destroy: () => void  // 销毁
  refresh: () => void  // 更新渲染器
}

export interface ZKMapOptions extends Partial<Lifecycle>{
  el: HTMLElement,
  baseMap: BaseMapOptions
}

export function createMap(options: ZKMapOptions): ZKMap {
  const lifecycleEmitter = lifecycle(options)
  const container = createContainer({ baseMap: options.baseMap })
  const view = createView({ el: options.el })
  const renderer = createRenderer(options.el, view.camera, container.scene)
  view.createControls(view.camera, renderer.webGLRenderer.domElement)
  renderer.startAnimationFrame(view.controls!)

  mouse.useMouse({
    el: options.el,
    container: container,
    camera: view.camera
  })
  const list: any[] = []
  const zkMap: ZKMap = {
    container,
    renderer,
    view,
    paths: {
      enable: false,
      data: undefined
    },
    setRandomObjects(nums: number) {
      // 添加立方体
      for (let i = list.length - 1; i >= 0; i--) {
        container.remove(list[i])
        list.splice(i, 1)
      }

      for (let i = 0; i < nums; i++) {
          let item: any = container.createCube({
            title: '货架' + i,
            name: '货架' + i,
            width: 5, height: 5 , depth: 4 + 10 * Math.random(), 
            color: '#4281F8', x: 1335 * Math.random(), y: 875 * Math.random(), z: 0
          })
          list.push(item)
      }
      zkMap.refresh()
    },
    usePaths(paths: [number, number][] | false) {
      if (paths === false) {
        zkMap.paths.enable = false
        zkMap.paths.data?.destroy()
        zkMap.paths.data = undefined
      } else {
        if (!zkMap.paths.enable) {
          zkMap.paths.data = createPaths(container.scene, paths as [number, number][])
        } else {
          zkMap.paths.data?.destroy()
          zkMap.paths.data = createPaths(container.scene, paths as [number, number][])
        }
        zkMap.paths.enable = true
        zkMap.refresh()
      }
    },
    destroy() {
      renderer.destroy()
      lifecycleEmitter.emit('unMountedHook')
    },
    refresh() {
      renderer.refresh()
      lifecycleEmitter.emit('updateHook')
    }
  }

  zkMap.refresh()
  lifecycleEmitter.emit('mountedHook')
  return zkMap
}
