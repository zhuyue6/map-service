import * as THREE from 'three'
import { Container } from '../container'

interface ClickEventConfig {
  // 点击事件配置
  enable: boolean
  list: string[]
}

interface MouseEventOptions {
  el: HTMLElement
  camera: THREE.Camera
  container: Container,
  clickEventConfig?: ClickEventConfig
}

const clickEventConfig: ClickEventConfig = {
  enable: true,
  list: [
    'selectEvent'
  ]
}

export function useMouse(options: MouseEventOptions) {
  const el = options.el
  const camera = options.camera
  const container = options.container
  const enableClick = options.clickEventConfig?.enable ?? clickEventConfig.enable
  if (enableClick) {
    const list = options.clickEventConfig?.list ?? clickEventConfig.list
    useClick({
      el,
      camera,
      container,
      list
    })
  }
}

interface ClickEventOptions {
  el: HTMLElement
  camera: THREE.Camera
  container: Container,
  list: string[]
}

function useClick(options: ClickEventOptions) {
  options.el.addEventListener('click', (event) => {
    const clickEventList = options.list
    if (clickEventList.includes('selectEvent')) {
      selectEvent({ 
        el: options.el, 
        camera: options.camera,
        container: options.container,
        event
      })
    }
  })
}

interface SelectEvent {
  el: HTMLElement
  camera: THREE.Camera
  container: Container
  event: MouseEvent
}

function selectEvent(e: SelectEvent) {
  // 将鼠标坐标归一化
  const raycaster = new THREE.Raycaster()
  const x = ((e.event.clientX - e.el.getBoundingClientRect().left) / e.el.offsetWidth) * 2 - 1; 
  const y = -((e.event.clientY - e.el.getBoundingClientRect().top) / e.el.offsetHeight) * 2 + 1

  const mouse = new THREE.Vector2(x, y)
  // 设置射线起点为鼠标位置，射线的方向为相机视角方向
  raycaster.setFromCamera(mouse, e.camera)
  // 计算射线相交
  const intersects = raycaster.intersectObjects(e.container.getObjects(), false)
  if (intersects.length > 0) {
    // 选中物体
    alert(`点击了${intersects[0].object.name}`)
  } 

}