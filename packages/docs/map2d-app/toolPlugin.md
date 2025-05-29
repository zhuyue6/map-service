# 工具插件
提供给应用各类工具能力，工具插件是一个具有enable/close 关键事件，通过app.emitter.on('xx') 反射器回调来处理数据

## 基础工具插件

app中注入了工具的功能, 本插件是基础插件默认注入

```ts
  import { createApp } from '@web-map-service/map2d-app'
  const app = createApp()

  const { tools } = app
```

## select
提供选中元素的能力，通过select反射回调
```ts
  const { select } = tools
  select.enable()
  app.emitter.on('select', (elements: Element[])=>{
    console.log(elements)
  })
```

**select事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |


## modify
提供修改元素的能力，通过modify反射回调
```ts
  const { modify, select } = tools
  modify.enable()
  select.enable()
  app.emitter.on('select', (elements: Element[])=>{
    modify.clean()
    for (const element of elements) {
      modify.add(element)
    }
  })

  app.emitter.on('modify', (elements: Element[])=>{
    console.log(elements)
  })
```

**modify事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| add | Element  |  是  |  添加元素为修改元素  |
| remove | Element  |  是  |  移除修改元素  |
| clean | undefined  |  否  |  清空修改元素 |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

## move
提供移动元素的能力，通过move反射回调
```ts
  const { move, select } = tools
  move.enable()
  select.enable()
  app.emitter.on('select', (elements: Element[])=>{
    move.clean()
    for (const element of elements) {
      move.add(element)
    }
  })

  app.emitter.on('move', (elements: Element[])=>{
    console.log(elements)
  })
```

**move事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| add | Element  |  是  |  添加元素为移动元素  |
| remove | Element  |  是  |  移除移动元素  |
| clean | undefined  |  否  |  清空移动元素 |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

## edit
edit工具是整合了select/move/modify 提供元素编辑的能力，通过edit反射回调
```ts
  const { edit } = tools
  edit.enable()

  app.emitter.on('edit', (elements: Element[])=>{
    console.log(elements)
  })
```

**edit事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

## measure
 measure 提供测绘能力，包括测面积和测距离，通过measure反射回调
```ts
  const { measure } = tools
  measure.enable()

  type MeasureType = 'distance' | 'area'

  app.emitter.on('measure', (elements: Element[]) => {
    console.log(elements)
  })
```

**measure事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |
| use | MeasureType  |  是  |  切换测量类型   |

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
  import { createApp } from '@web-map-service/map2d-app'

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