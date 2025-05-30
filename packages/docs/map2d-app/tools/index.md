# 工具插件
提供给应用各类工具能力，工具插件是一个具有enable/close 关键事件，通过app.emitter.on('xx') 反射器回调来处理数据

## 基础工具插件

本插件是默认注入的基础插件，对app中提供了工具的能力

```ts
  import { createApp } from '@web-map-service/map2d-app'
  const app = createApp()
  const { tools } = app
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2 items-center">
      <el-select :modelValue="state.drawType" @change="changeDrawType">
        <el-option value="ap" label="ap"></el-option>
      </el-select>
      <el-button class="ml-2 " @click="switcher('draw', !state.draw)" type="primary">{{ `${state.draw ? '关闭': '启用'} draw交互项`}}</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('edit', !state.edit)" type="primary">{{ `${state.edit ? '关闭': '启用'} edit交互项`}}</el-button>
    </div>
    <div class="flex mb-2">
      <el-select :modelValue="state.measureType" @change="changeMeasureType">
        <el-option value="distance" label="测距"></el-option>
        <el-option value="area" label="测面积"></el-option>
      </el-select>
      <el-button class="ml-2 mr-2"  @click="switcher('measure', !state.measure)" type="primary">{{ `${state.measure ? '关闭': '启用'} measure交互项`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from 'web-map-service'

  const state = reactive({
    draw: false,
    drawType: 'ap',
    edit: false,
    measure: false,
    measureType: 'distance',
  })

  const mapRef = ref()

  let [draw, edit, measure] = []

  function changeDrawType(type) {
    state.drawType = type
    draw.use(type)
  }

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
      case 'draw': 
        draw.enable()
        break
      case 'edit': 
        edit.enable()
        break
      case 'measure': 
        measure.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'draw': 
        draw.close()
        break
      case 'edit': 
        edit.close()
        break
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
    draw = app.tools.draw
    edit = app.tools.edit
    measure = app.tools.measure
    changeDrawType(state.drawType)
    changeMeasureType(state.measureType)
  })

</script>