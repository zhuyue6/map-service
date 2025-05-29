<template>
  <div class="w-full h-full" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'
  const mapRef = ref()

  onMounted(()=> {
    const app = createApp({
      el: mapRef.value,
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
  })
</script>