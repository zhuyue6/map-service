import * as THREE from 'three'
import { Container } from '../container'

interface Select {
  el: HTMLElement
  camera: THREE.Camera
  container: Container
  event: MouseEvent
}

export function useSelect() {

}

export function selectEvent(e: SelectEvent) {
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