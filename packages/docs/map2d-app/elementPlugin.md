# 元素插件
提供各类元素创建、修改、各类型图层信息等功能

## 基础元素插件

app中注入了元素的功能, 本插件是基础插件默认注入

```ts
   import { createApp } from '@web-map-service/map2d-app'
   const app = createApp()

   const { element } = app

   interface ElementOptions {
      id?: number,
      style?: Style
      data: ElementData
    }

  interface Element {
    id: number
    type: string
    getSElement(): SElement // 地图服务元素
    style?: Style               // 样式
    setStyle(style: Style): void  // 设置样式
    data: ElementData              // 元素数据
    setData(data: ElementData): void  // 设置元素数据
  }

  interface Layer {
    id: number
    type: string
    sElementType: string,
    create(options: ElementOptions): Element,
    remove(element: Element): void,
    getElements(): Element[]
    getElementById(id: number): Element | undefined
  }

```
**元素插件事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| create |  ElementOptions  |  是  |  创建元素 |
| remove |  Element  |  是  |  移除元素 |
| addLayer |  Layer  |  是  |  添加图层 |
| removeLayer |  Layer  |  是  |  移除图层 |
| getLayers |  undefined  |  是  |  获取所有图层 |
| getLayerByType |  string  |  是  |  通过图层类型获取图层 |
| getLayerById |  number  |  是  |  通过图层ID获取图层 |


**元素事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| getSElement |  ElementOptions  |  是  |  获取地图服务元素 |
| setData |  Element  |  是  |  设置数据 |
| setStyle |  Layer  |  是  |  设置样式 |

## ap插件

元素插件中注入了ap的功能, 提供ap元素的操作处理

```js
   element.create({
    type: ap,
    data: [{
      center: [3000, 3000],
      radius: 1000
     }]
   })

```

## 演示

<div class="flex">
  <el-select v-model="state.selected" class="w-[300px] mb-2 mr-2">
    <el-option :value="item.value" :key="item.value" v-for="item of state.options"></el-option>
  </el-select>

  <el-button type="primary" @click="create">创建</el-button>
</div>
<div class="w-[500px] h-[500px] border-[1px] border-solid" ref="mapRef"></div>

<script setup>
  import { createApp } from '@web-map-service/map2d-app'
  import { onMounted, ref, reactive } from 'vue'

  const app = ref()

  const mapRef = ref()
  const state = reactive({
    selected: 'ap',
    options: [{
      value: 'ap'
    }]
  })

  function create() {
    let data = [
      [Math.random() * 10000, Math.random() * 10000]
      [Math.random() * 10000, Math.random() * 10000],
      [Math.random() * 10000, Math.random() * 10000],
      [Math.random() * 10000, Math.random() * 10000],
    ]
    if (['ap'].includes(state.selected)) {
      data = {
        center: [Math.random() * 10000, Math.random() * 10000],
        radius: Math.random() * 1000
      }
    }

    app.value.element.create({
      type: state.selected,
      data
    })
  }

  onMounted(()=>{
    app.value = createApp({
      el: mapRef.value,
      baseMap: {
        url: '/images/map.jpg'
      },
    })
  })

</script>