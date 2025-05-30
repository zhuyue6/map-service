# move
```ts
  import { map2d } from 'web-map-service'
  const { createMoveInteractive, createSelectInteractive } = map2d
  const select = createSelectInteractive(map.interactiveManager)
  const move = createMoveInteractive(map.interactiveManager)
  // 启用移动
  move.enable()
  select.enable()
  // move 通常要配合select使用
  map.emitter.on('select', (data: Element[])=>{
    // 获取所有的选择元素
    for (const item of data) {
      move.add(item)
    }
  })
```
**事件**
| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     否      |  启动交互 |
| close    |  undefined  |     否      |  关闭交互 |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| move | Element[]   |  移动结束后的反射事件  |

```ts
  map.emitter.on('move', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('move', !state.move)" type="primary">{{ `${state.move ? '关闭': '启用'} move交互`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap, map2d } from "web-map-service";
  import { ref, onMounted, reactive } from 'vue'
  const { createSelectInteractive, createMoveInteractive } = map2d

  const state = reactive({
    move: false,
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [select, move] = []

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'move': 
        move.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'move': 
        move.close()
        break
    }
    state[type] = false
  }

  onMounted(()=> {
    map = createMap({
      el: mapRef.value,
    })

    const layer = map.container.layerManager.create()
    layer.create({
      type: 'circle',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })
    interactiveManager = map.interactiveManager;
    select = createSelectInteractive(interactiveManager)
    move = createMoveInteractive(interactiveManager)
    select.enable()
    map.emitter.on('select', (data: Element[])=>{
      // 获取所有的选择元素
      move.clean()
      for (const item of data) {
        move.add(item)
      }
    })
  })
</script>