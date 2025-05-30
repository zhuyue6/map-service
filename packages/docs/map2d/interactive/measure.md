# measure
measure 提供测绘能力，包括测面积和测距离，通过measure反射回调

```ts
  import { map2d } from 'web-map-service'
  const { createMeasureInteractive } = map2d
  const measure = createMeasureInteractive(map.interactiveManager)
  // 启用测面积
  measure.enable()
  measure.use('area')

  // 测距离
  measure.use('distance')

```

**事件**
| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     否      |  启动交互 |
| close    |  undefined  |     否      |  关闭交互 |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| measure | Measure   |  测量结束后的反射事件  |

```ts
  interface Measure {
    type: 'distance' | 'area'
    data?: number
  }
  map.emitter.on('measure', (measure: Measure)=>{
    console.log(measure)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-select :modelValue="state.measureType" @change="changeMeasureType">
        <el-option value="distance" label="测距"></el-option>
        <el-option value="area" label="测面积"></el-option>
      </el-select>
      <el-button class="ml-2 mr-2"  @click="switcher('measure', !state.measure)" type="primary">{{ `${state.measure ? '关闭': '启用'} measure交互`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap, map2d } from "web-map-service";
  import { ref, onMounted, reactive } from 'vue'
  const { createMeasureInteractive, createSelectInteractive, createModifyInteractive, createMoveInteractive, createDrawInteractive } = map2d

  const state = reactive({
    measure: false,
    measureType: 'distance',
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [ measure] = []
  function changeMeasureType(type) {
    state.measureType = type
    measure.use(type)
  }

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'measure': 
        measure.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'measure': 
        measure.close()
        break
    }
    state[type] = false
  }

  onMounted(()=> {
    map = createMap({
      el: mapRef.value,
    })
    interactiveManager = map.interactiveManager;
    measure = createMeasureInteractive(interactiveManager)
  })
</script>