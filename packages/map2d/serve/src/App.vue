<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-full" id="map" ref="mapRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { createMap } from "../../src";

  const mapRef = ref<HTMLElement>()

  onMounted(() => {
    const map = createMap({
      el: mapRef.value as HTMLElement,
      baseMap: {
        url: 'images/map.jpg'
      }
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


    const element2 = layer.create({
      type: 'circle',
      
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })


    const element3 = layer.create({
      type: 'line',
      rotate: 15,
      style: {
        stroke: {
          color: 'red'
        }
      },
      data: [[1000, 1000], [2000, 1000]]
    })

    const element4 = layer.create({
      type: 'image',
      style: {
        stroke: {
          color: 'red'
        }
      },
      rotate: 30,
      image: {
        src: '/imgs/position.png'
      },
      data: [6000, 6000]
    })
  })
</script>