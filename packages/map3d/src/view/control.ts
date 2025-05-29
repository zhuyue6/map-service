import { Camera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const enablePan = true      // 启用平移
const enableRotate = true   // 启用旋转
const enableDamping = true  // 启用阻尼
const near = 10          // 近平面
const far = 5000            // 远平面距离
const minPolarAngle = Math.PI / 4     // 下旋转范围
const maxPolarAngle = Math.PI / 1.4   // 上旋转范围
const minAzimuthAngle = -Math.PI / 6  // 右旋转范围
const maxAzimuthAngle = Math.PI / 4  // 左旋转范围

interface ControlsOptions {
  enableDamping: boolean
  dampingFactor: number
  autoRotate: boolean
  autoRotateSpeed: number
}

export type Control = OrbitControls

export function createControls(
  camera: Camera,
  rendererDomElement: HTMLCanvasElement,
  options?: Partial<ControlsOptions> 
): Control {
  const controls = new OrbitControls(camera, rendererDomElement)
  const iOptions = {
    enablePan,
    enableRotate,
    enableDamping,
    minDistance: near,
    maxDistance: far,
    minPolarAngle,
    maxPolarAngle,
    minAzimuthAngle,
    maxAzimuthAngle,
  }

  controls.target.set(605, 500, 0)
  setContorls(controls, {
    ...iOptions,
    ...options
  })
  return controls
}

export function setContorls(controls: OrbitControls, options: Record<string, unknown>) {
  for (const [key, value] of Object.entries(options)) {
    (controls as any)[key] = value
  }
}
