import * as THREE from 'three'
import { createCamera } from './camera'
import { createControls, type Control } from './control'

export interface View {
  camera: THREE.Camera
  controls: null | Control
  createControls(camera: THREE.Camera, rendererDomElement: HTMLCanvasElement): void
}

interface ViewOptions {
  el: HTMLElement
}

export { Control }

export function createView(options: ViewOptions): View {
  const camera = createCamera(options.el)
  const controls: null | Control = null
  const view: View = {
    camera,
    controls,
    createControls(camera: THREE.Camera, rendererDomElement: HTMLCanvasElement): Control {
      view.controls = createControls(camera, rendererDomElement)
      return view.controls
    }
  }
  return view
}