<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-full" ref="mapRef"></div>
    <div class="grow flex justify-center h-[70px] shrink-0">
      <div class="mt-[16px]">
        对象数量：
        <input type="text" class="w-[200px] border" maxlength="4" :value="state.objectNumbers" @input="setRandomObjects" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createMap } from '../../src'

  interface State {
    useMaterial: boolean
    objectNumbers: number
    map: ReturnType<typeof createMap> | null
  }

  const state: State = reactive({
    useMaterial: false,
    objectNumbers: 100,
    map: null
  })

  const mapRef = ref()

  onMounted(()=>{
    state.map = createMap({
      el: mapRef.value,
      baseMap: {
        url: 'images/map.jpg'
      },
      mounted() {
        console.log(111)
      }
    })
    setRandomObjects()
  });

  (window as any).usePaths = usePaths

  async function usePaths(paths: [number, number][] | string) {
    let data: [number, number][] = []
    if (typeof paths === 'string') {
      data = JSON.parse(paths)
    } else {
      data = paths
    }
     
    state.map!.usePaths(data)
  }

  function setRandomObjects(e?: InputEvent) {
    if (e) {
      state.objectNumbers = e.target?.value as number
    }
    const nums = Number.isNaN(Number(state.objectNumbers)) ? 0 : Number(state.objectNumbers)
    state.map!.setRandomObjects(nums)
  }
</script>