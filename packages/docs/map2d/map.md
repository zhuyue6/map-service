# 2D地图API

## 创建地图  
```js
  import { createMap } from 'web-map-service'
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
  import { createMap } from "web-map-service";
  import { ref, onMounted } from 'vue'

  const mapRef = ref<HTMLElement>()

  onMounted(()=> {
    const map = createMap({
      el: mapRef.value,
      baseMap: {
        url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
      }
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