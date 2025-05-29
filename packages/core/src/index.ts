import './styles/index.scss'
import '@web-map-service/map2d/style.css'
import { createMap } from '@web-map-service/map2d'

const map = createMap({
  el: document.getElementById('#app')
})

// 创建图层
const layer = map.container.layerManager.create({
  type: 'test1',
})

const element = layer.create({
  type: 'polygon',
  rotate: 59,
  data: [[100, 100], [2000, 100], [2000, 2000], [100, 10000]]
})