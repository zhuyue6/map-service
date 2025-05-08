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
        url: 'imgs/map.png'
      }
    })
    // 创建图层
    const layer = map.container.layerManager.create({
      type: 'test1',
    })

    const element = layer.create({
      type: 'polygon',
      data: [[100, 100], [2000, 100], [2000, 2000], [100, 10000]]
    })


    const element2 = layer.create({
      type: 'circle',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })

    // map.interactive.plugins.select.enable()

    // map.interactive.plugins.select.emitter.on('select', (e)=>{
    //   console.log('select:', e)
    // })

    map.interactive.plugins.draw.emitter.on('draw', (e)=> {
      console.log('end:', e)
    })
    map.interactive.plugins.modify.enable()
    map.interactive.plugins.move.enable()

    map.interactive.plugins.select.enable()
    map.interactive.plugins.select.emitter.on('select', (list)=>{
      map.interactive.plugins.move.clean()
      map.interactive.plugins.modify.clean()
      for (const item of list) {
        map.interactive.plugins.move.add(item)
        map.interactive.plugins.modify.add(item)
      }
    })

    
    // map.interactive.plugins.draw.enable()
    // map.interactive.plugins.draw.use('polygon')
    // 图层添加绘制交互
    // layer.draw.enable({ type: 'rect' })
    // setTimeout(()=>{
    //   // layer.draw.close()
    // }, 3000)
    // // 元素添加编辑交互
    const element3 = layer.create({
      type: 'line',
      style: {
        stroke: {
          color: 'red'
        }
      },
      data: [[1000, 1000], [2000, 1000], [5000,3000]]
    })
    map.interactive.plugins.modify.add(element3)
    // element3.interactive.enable()
    // setTimeout(()=>{
    //   // element3.interactive.close()
    // }, 3000)
  })
</script>