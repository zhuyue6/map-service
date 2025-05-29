import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

interface GeometryOptions extends Partial<Space>, Partial<Coordinate> {
  color?: string | number
  name?: string
  title?: string 
}

export interface GeometryElement {
  geometry: THREE.BufferGeometry
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh
  destroy: () => void
}


interface Cube extends GeometryElement {
  label?: CSS3DObject
  geometry: THREE.BoxGeometry
}

export function createCube(options: GeometryOptions): Cube {
  // 添加立方体
  const geometry = new THREE.BoxGeometry(options.width, options.height, options.depth);
  const material = new THREE.MeshBasicMaterial({ color: options.color });
  const mesh = new THREE.Mesh(geometry, material)
  const x = options.x ?? 0
  const y = options.y ?? 0
  const z = (options.z ?? 0) + (options?.depth ?? 0) / 2
  let label = undefined
  geometry.translate(x, y, z)
  mesh.name = options.name!
  if (options.title) {
    label = createLabel(options.title)
    label.position.set(x, y, z + 15)
    mesh.add(label)
  }
  const cube: Cube = {
    geometry,
    material,
    mesh,
    label,
    destroy() {
      if (label) mesh.remove(label)
      geometry.dispose()
      material.dispose()
    }
  }
  
  return cube
}

export function createLabel(text: string) {
  const divElement = document.createElement('div')
  divElement.innerHTML = text
  const label = new CSS3DObject(divElement)
  return label
}


interface Cylinder extends GeometryElement{
  geometry: THREE.CylinderGeometry
}

export function createCylinder(options: GeometryOptions) {
  const geometry = new THREE.CylinderGeometry(5, 5, options.height, 32, );
  const material = new THREE.MeshBasicMaterial({ color: options.color, wireframe: true, });
  const mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.x = Math.PI / 2
  geometry.translate(options.x ?? 0, ((options.z ?? 0) + options?.height / 2)  ?? 0, -(options.y ?? 0))
  const substance: Cylinder = {
    geometry,
    material,
    mesh,
    destroy() {
      geometry.dispose()
      material.dispose()
    }
  }
  return substance
}