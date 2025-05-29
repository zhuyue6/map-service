<template>
  <div class="w-full h-full" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'
  const mapRef = ref()

  onMounted(()=> {
    const app = createApp({
      el: mapRef.value
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