import { createMap } from "../src";

const map = createMap({
  el: mapRef.value as HTMLElement,
  baseMap: {
    url: 'imgs/map.png'
  }
})

const layer = map.container.layerManager.create({
  type: 't'
})


