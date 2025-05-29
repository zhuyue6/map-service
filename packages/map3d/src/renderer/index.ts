import * as THREE  from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { Control } from '../view'
import { util } from '../shared'

const bgColor = 0x808080  // 背景色
const bgAlpha = 1  // 背景色透明度

export interface Renderer {
  webGLRenderer: THREE.WebGLRenderer, 
  cssRenderer: CSS3DRenderer
  setSize(width: number, height: number): void
  destroy(): void
  refresh(): void
  startAnimationFrame(controls: Control): void
  stopAnimationFrame(): void
}

export function createRenderer(
  el: HTMLElement,
  camera: THREE.Camera,
  scene: THREE.Scene,
): Renderer {
  const webGLRenderer = new THREE.WebGLRenderer({ antialias: true })
  const cssRenderer = new CSS3DRenderer()
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = '0px';
  cssRenderer.domElement.style.left = '0px';
  cssRenderer.domElement.style.pointerEvents = 'none';
  setSize(webGLRenderer, el.clientWidth, el.clientHeight)
  setSize(cssRenderer, el.clientWidth, el.clientHeight)
  webGLRenderer.setClearColor(bgColor, bgAlpha)

  refresh(webGLRenderer, cssRenderer, camera, scene)

  el.appendChild(webGLRenderer.domElement)
  el.appendChild(cssRenderer.domElement)

  let animationFrame: null | number = null
  function animate(controls: Control) {
    animationFrame = requestAnimationFrame( () => animate(controls) );
    controls.update()
    refresh(webGLRenderer, cssRenderer, camera, scene)
  }

  const renderer: Renderer = {
    webGLRenderer, 
    cssRenderer,
    startAnimationFrame(controls: Control) {
      animate(controls)
    },
    stopAnimationFrame() {
      if (util.isDef(animationFrame)) {
        cancelAnimationFrame(animationFrame!)
        animationFrame = null
      }
    },
    setSize(width: number, height: number) {
      setSize(webGLRenderer, width, height)
      setSize(cssRenderer, width, height)
    },
    refresh() {
      refresh(webGLRenderer, cssRenderer, camera, scene)
    },
    destroy() {
      webGLRenderer.dispose()
      el.removeChild(webGLRenderer.domElement)
      el.removeChild(cssRenderer.domElement)
      renderer.stopAnimationFrame()
    }
  }

  return renderer
}

function setSize(renderer: THREE.WebGLRenderer | CSS3DRenderer, width: number, height: number) {
  renderer.setSize(width, height)
}

function refresh(
  renderer: THREE.WebGLRenderer, 
  cssRenderer: CSS3DRenderer,
  camera: THREE.Camera,
  scene: THREE.Scene
) {
  cssRenderer.render(scene, camera)
  renderer.render(scene, camera)
}