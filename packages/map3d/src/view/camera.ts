import { PerspectiveCamera, Camera } from 'three'

const near = 0.1              // 近平面
const far = 10000            // 远平面距离
const fov = 45             // 相机视角
const coord = {       // 相机位置
  x: 600,
  y: -500,
  z: 1000
}

export function createCamera(el: HTMLElement): PerspectiveCamera {
  const camera = new PerspectiveCamera(
    fov,
    el.clientWidth  / el.clientHeight,
    near,
    far
  );
  setXYZ(camera, coord)
  return camera
}

export function setXYZ(camera: Camera, {
  x=0, y=0, z=0
}: Partial<Coordinate>) {
  camera.position.set(x, y, z);
}
