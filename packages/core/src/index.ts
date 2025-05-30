import './styles/index.scss'
import '@web-map-service/map2d/style.css'
import { createApp } from '@web-map-service/map2d-app'

const app = createApp({
  el: '#app',
  baseMap: {
    url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
  }
})

app.element.create({
  type: 'ap',
  data: {
    center: [3000, 4000],
    radius: 1000
  }
})