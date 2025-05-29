import { Scene, CircleGeometry, MeshBasicMaterial, Mesh } from 'three'

interface path {
  geometry: CircleGeometry
  material: MeshBasicMaterial
  mesh: Mesh
  destroy: () => void
}

export function createPaths(scene: Scene, paths: [number, number][], color='#00C297') {
  const list: path[] = []
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const geometry = new CircleGeometry( i === 0 ? 6 : 4, 32 );
    const material = new MeshBasicMaterial( { color: i === 0 ? '#ff0000' : color, wireframe: true  } );
    const mesh = new Mesh( geometry, material );
    geometry.translate(...path, 1)
    const pathItem = {
      geometry,
      material,
      mesh,
      destroy() {
        scene.remove( pathItem.mesh );
        material.dispose()
        geometry.dispose()
      }
    }
    scene.add( pathItem.mesh );
    list.push(pathItem)
  }
  const pathsItem = {
    destroy() {
      for(let i = list.length - 1; i >= 0; i--) {
        list[i].destroy?.()
      }
    },
    paths: list
  }
  return pathsItem
}