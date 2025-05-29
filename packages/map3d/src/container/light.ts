import { Light, AmbientLight, DirectionalLight } from 'three'

const color = 0xffffff  // 光颜色
const strength = 0.5    // 光强度

export function createLight(type='ambient') {
  let light: Light = new AmbientLight(color, strength)
  switch(type) {
    case 'directional': 
      light = new DirectionalLight(color, strength);
      break
  }
  light.name = 'light'
  return light
}
