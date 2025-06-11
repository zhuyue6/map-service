# modify
提供修改服务元素能力，modify交互通常要配合select交互使用，选择的元素通过add方法添加为modify元素
```ts
  import { map2d } from 'web-map-service'
  const { createModifyInteractive, createSelectInteractive } = map2d
  
  const select = createSelectInteractive(map.interactiveManager)
  const modify = createModifyInteractive(map.interactiveManager)
  // 启用选中
  modify.enable()
  select.enable()
  // modify 通常要配合select使用
  map.emitter.on('element:select', (data: Element[])=>{
    // 获取所有的选择元素
    for (const item of data) {
      modify.add(item)
    }
  })
```
**事件**
| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     否      |  启动交互 |
| close    |  undefined  |     否      |  关闭交互 |
| add    |  Element  |     是      |  把当前元素添加至修改列表 |
| remove    |  Element  |     是      |  把当前元素移除修改列表 |
| clean  |  undefined  |     否      |  清空所有修改元素 |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| modify | Element[]   |  修改结束后的反射事件  |

```ts
  map.emitter.on('element:modify', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('modify', !state.modify)" type="primary">{{ `${state.modify ? '关闭': '启用'} modify交互`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap, createSelectInteractive, createModifyInteractive } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'

  const state = reactive({
    modify: false,
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [select, modify] = []
  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'modify': 
        modify.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'modify': 
        modify.close()
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
    modify = createModifyInteractive(interactiveManager)
    select.enable()
    const layer = map.container.layerManager.create()
    layer.create({
      type: 'circle',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })

    layer.create({
      type: 'polygon',
      data: [[3000, 3000], [4000, 3000], [4000, 4000], [3000, 4000]]
    })

    map.emitter.on('element:select', (data: Element[])=>{
      // 获取所有的选择元素
      modify.clean()
      for (const item of data) {
        modify.add(item)
      }
    })
  })
</script>