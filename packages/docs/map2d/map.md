# 2D地图API

## 创建地图  
```js
  import { createMap } from '@web-map-service/map2d'
  const map = createMap({
    el: 'map',
    baseMap: {
      url: '/images/map.jpg'
    }
  })

```

<div class="w-[500px] h-[500px] border">
  <div class="w-full h-full" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap } from "@web-map-service/map2d";
  import { ref, onMounted } from 'vue'

  const mapRef = ref<HTMLElement>()

  onMounted(()=> {
    const map = createMap({
      el: mapRef.value,
      baseMap: {
        url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
      }
    })
  
    const layer = map.container.layerManager.create({
      type: 't'
    })
  
    const element = layer.create({
      type: 'polygon',
      data: [[100, 100], [2000, 100], [2000, 2000], [100, 10000]]
    })
  })
</script>

## 地图目前提供模块

```js
  const {
    container,
    renderer,
    view,
    interactive
  } = map
```