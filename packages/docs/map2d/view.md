# 视图
控制地图的视窗如何展示

```ts
  interface View {
    setCenter(coord: Coord): void
    setRotation(angle: number): void
    getZoom(): number | undefined
    setZoom(zoom: number): void
    setMinZoom(zoom: number): void
    setMaxZoom(zoom: number): void
  }
  const { view } = map
```

**view事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| setCenter      |  [number, number]   |     是      |  设置视窗中心位置 |
| setRotation   | number |   是     | 设置视图旋转 【单位弧度】 |
| getZoom   | undefined   |   否   | 获取视窗缩放范围 |
| setZoom   |  number  |     是      | 设置视窗缩放范围 |
| setMinZoom   | number   |   是   | 设置视窗最小缩放 |
| setMaxZoom   |  number  |     是      | 设置视窗最大缩放 |

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="setCenter">视图中心移动</el-button>
      <div class="flex">
        <span>x </span> <el-input v-model="state.center[0]" class="w-[50px] ml-1" size="small" />
        <span>y </span> <el-input v-model="state.center[1]" class="w-[50px] ml-1" size="small" />
      </div>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="setZoom">视图缩放</el-button>
      <div class="flex">
        <el-input v-model="state.zoom" class="w-[50px]" size="small" />
      </div>   
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="setRotation">视图旋转</el-button>
      <div class="flex">
        <el-input v-model="state.rotate" class="w-[50px]" size="small" />
      </div>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="setMinZoom">视图最小缩放</el-button>
      <div class="flex">
        <el-input v-model="state.min" class="w-[50px]" size="small" />
      </div>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="setMaxZoom">视图最大缩放</el-button>
      <div class="flex">
        <el-input v-model="state.max" class="w-[50px]" size="small" />
      </div>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'

  const state = reactive({
    center: [0, 0],
    zoom: 10,
    max: 22,
    min: 1,
    rotate: 0
  })

  const mapRef = ref<HTMLElement>()
  let map
  let view
  function setCenter() {
    view.setCenter(state.center)
  }

  function setZoom() {
    view.setZoom(Number(state.zoom))
  }

  function setRotation() {
    view.setRotation(state.rotate)
  }

  function setMaxZoom() {
    view.setMaxZoom(Number(state.max))
  }

  function setMinZoom() {
    view.setMinZoom(state.min)
  }

  onMounted(()=> {
    map = createMap({
      el: mapRef.value,
      baseMap: {
        url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
      }
    })
  
    view = map.view
  })
</script>