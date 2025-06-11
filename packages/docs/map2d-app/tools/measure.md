
# measure
 measure 提供测绘能力，包括测面积和测距离，通过measure反射回调
```ts
  const { measure } = tools
  measure.enable()

  type MeasureType = 'distance' | 'area'
```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |
| use | MeasureType  |  是  |  切换测量类型   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| measure | Element[]   |  测量结束后的反射事件  |

```ts
  interface Measure {
    type: 'distance' | 'area'
    data?: number
  }
  app.emitter.on('measure', (measure: Measure)=>{
    console.log(measure)
  })
```

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-select :modelValue="state.measureType" @change="changeMeasureType">
        <el-option value="distance" label="测距"></el-option>
        <el-option value="area" label="测面积"></el-option>
        <el-option value="angle" label="测角度"></el-option>
      </el-select>
      <el-button class="ml-2 mr-2"  @click="switcher('measure', !state.measure)" type="primary">{{ `${state.measure ? '关闭': '启用'} measure插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'

  const state = reactive({
    measure: false,
    measureType: 'distance',
  })

  const mapRef = ref()

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


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    measure = app.tools.measure
    changeMeasureType(state.measureType)
  })

</script>