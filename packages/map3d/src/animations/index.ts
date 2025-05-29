import { Camera } from "three"

const max = 1
const min = 0.2
const frames = 1000 / 60 // 帧率

export function fadeIn (container: HTMLElement, speed=1) {
  return  new Promise((resolve) => {
    function loop() {
      const increment =
          parseFloat(container.style.opacity) + speed / 100
      if (increment > max)
          return resolve((container.style.opacity = '1'))
      container.style.opacity = (
          parseFloat(container.style.opacity) +
          speed / 100
      ).toString()
      setTimeout(loop, frames)
    }
    container.style.opacity = min.toString()
    loop()
  })
}

export function fadeOut (container: HTMLElement, speed=1) {
  return  new Promise((resolve) => {
    function loop() {
      const increment =
          parseFloat(container.style.opacity) - speed / 100
      if (increment > max)
          return resolve((container.style.opacity = '0'))
      container.style.opacity = (
          parseFloat(container.style.opacity) -
          speed / 100
      ).toString()
      setTimeout(loop, frames)
    }
    container.style.opacity = max.toString()
    loop()
  })
}

export function cameraRotate360(camera: Camera, speed=25) {
  camera.position.z = far
  const animation = () => {
      if (this.camera.position.z - entryAnimationSpeed < minZ) {
          this.camera.position.z = minZ
          this.controls.maxDistance = far / 4.5
          this.animates.delete(animation)
          return
      }
      this.camera.position.z -= entryAnimationSpeed
  }

  setTimeout(() => this.animates.add(animation), 2000)
}