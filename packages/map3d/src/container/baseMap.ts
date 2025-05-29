import * as THREE from 'three'
import { GeometryElement } from './geometryElement'

interface BaseMap extends GeometryElement {
  geometry: THREE.PlaneGeometry
}

export type BaseMapOptions = Partial<{
  width: number,
  height: number,
  color: string,
  url: string
}>

const baseMapWidth = 1000  // 底图宽度
const baseMapHeight = 1000  // 底图高度

export function createBaseMap(options: BaseMapOptions) {
  const width = options?.width ?? baseMapWidth
  const height = options?.height ?? baseMapHeight
  const geometry = new THREE.PlaneGeometry(width, height);
  let color, map
  if (options.url) {
    const textLoader = new THREE.TextureLoader();
    map = textLoader.load(options.url)
  } else {
    color = options.color
  }
  const material = new THREE.MeshBasicMaterial({
    color,
    map,
    side: THREE.DoubleSide, transparent: true
  });
  const mesh = new THREE.Mesh( geometry, material );
  mesh.name = 'baseMap'
  geometry.translate(width / 2, height / 2, 0)
  const baseMap: BaseMap = {
    geometry,
    material,
    mesh,
    destroy() {
      geometry.dispose()
      material.dispose()
    }
  }
  return baseMap
}