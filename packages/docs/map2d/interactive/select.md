# select
提供地图服务元素能力, 按下ctrl 多选

```ts
  import { map2d } from 'web-map-service'
  const { createSelectInteractive } = map2d
  const select = createSelectInteractive(map.interactiveManager)
  // 启用选中
  select.enable()
```
**事件**
| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     否      |  启动交互 |
| close    |  undefined  |     否      |  关闭交互 |
| add    |  Element  |     否      |  添加元素为选中 |
| remove    |  Element  |     否      |  移除元素为选中 |
| clean    |  undefined  |     否      |  移除所有选中 |


**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| element:select | Element[]   |  选择结束后的反射事件  |

```ts
  map.emitter.on('element:select', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2" @click="switcher('select', !state.select)" type="primary">{{ `${state.select ? '关闭': '启用'} select交互`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap, createSelectInteractive } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'

  const state = reactive({
    select: false,
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [select] = []

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'select': 
        select.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'select': 
        select.close()
        break
    }
    state[type] = false
  }

  onMounted(()=> {
    map = createMap({
      el: mapRef.value,
    })

    interactiveManager = map.interactiveManager;
    select = createSelectInteractive(interactiveManager)
    enable('select')
    const layer = map.container.layerManager.create()
    layer.create({
      type: 'circle',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })

    layer.create({
      type: 'circle',
      data: {
        center: [8000, 8000],
        radius: 1000
      }
    })
    map.emitter.on('element:select', (data: Element[])=>{
      // 获取所有的选择元素
    })
  })
</script>