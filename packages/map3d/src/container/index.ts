import * as THREE from 'three'
import { createScene } from './scene'
import { createLight } from './light'
import { createCube, GeometryElement } from './geometryElement'
import { createBaseMap, BaseMapOptions } from './baseMap'

export interface Container {
  scene: THREE.Scene
  light: THREE.Light
  getObjects(): THREE.Object3D[]
  selected: GeometryElement[]
  createCube(options: any): ReturnType<typeof createCube>
  remove(element: GeometryElement): void
}

interface ContainerOptions {
  baseMap: BaseMapOptions
}

export function createContainer(options: ContainerOptions) {
  const scene = createScene();
  
  // 添加光源
  const light: THREE.Light = createLight()
  scene.add(light)

  // 添加底图
  const baseMap = createBaseMap(options.baseMap)
  scene.add(baseMap.mesh);
  const container: Container = {
    scene,
    light,
    selected: [],
    getObjects() {
      const list = scene.children.filter((item)=>{
        return item.name !== 'light' && item.name !== 'baseMap'
      })
      return list
    },
    createCube(options) {
      const cube = createCube(options)
      scene.add(cube.mesh)
      return cube
    },
    remove(element: GeometryElement) {
      scene.remove(element.mesh)
      element.destroy()
    }
  }
  return container
}