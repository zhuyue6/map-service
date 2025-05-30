# 交互管理器
对交互进行管理操作

```ts
  interface InteractiveManager {
    add(interactive: InteractiveItem): void
    close(interactive: InteractiveItem): void
    clean(): void
    getOlMap(): OlMap
    getContainer(): Container
    getEmitter(): emitter.Emitter
    getInteractiveItems(): InteractiveItem[]
  }
  const { interactive } = map
```

**InteractiveManager事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| add   | InteractiveItem |   是     | 添加交互项 |
| close   | InteractiveItem   |   是   | 删除交互项 |
| clean   |  undefined  |     否      | 清空交互项 |
| getOlMap   | undefined   |   否   | 删除交互项 |
| getContainer   |  undefined  |     否      | 清空交互项 |
| getEmitter   | undefined   |   否   | 删除交互项 |
| getInteractiveItems   | undefined   |   否   | 获取当前所有的交互项 |

## 交互
交互由交互基本信息和交互事件组成，通常交互事件会通过emitter对外抛出相应的回调函数，交互项的通用事件是enable/close代表启用和停用。  
有一些交互项还会有其他的交互事件  

```ts
  type InteractiveEvent<T extends Record<string, unknown>> = {
    enabled: boolean,
    enable(): void 
    close(): void
    destroy(): void
  } & T

  type Interactive<T extends Record<string, unknown> = Record<string, unknown>> = {
    id: number
    type: string
  } & InteractiveEvent<T>
```

**Interactive通用事件**


| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     是      |  启用交互 |
| close   | undefined   |   是   | 关闭交互 |
| destroy | undefined   |   是   | 销毁交互 |

## 已有的交互插件
目前有绘制、测距、修改、移动、选择交互
每一个交互项目都是通过enable 启用, close 关闭，基本有一些特殊的交互事件

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2 items-center">
      <el-select :modelValue="state.drawType" @change="changeDrawType">
        <el-option value="circle" label="绘制圆形"></el-option>
        <el-option value="polygon" label="绘制多边形"></el-option>
        <el-option value="line" label="绘制线段"></el-option>
      </el-select>
      <el-button class="ml-2 " @click="switcher('draw', !state.draw)" type="primary">{{ `${state.draw ? '关闭': '启用'} draw交互项`}}</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" @click="switcher('select', !state.select)" type="primary">{{ `${state.select ? '关闭': '启用'} select交互项`}}</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('modify', !state.modify)" type="primary">{{ `${state.modify ? '关闭': '启用'} modify交互项`}}</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('move', !state.move)" type="primary">{{ `${state.move ? '关闭': '启用'} move交互项`}}</el-button>
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

<script setup lang="ts">
  import { createMap } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'
  import { createMeasureInteractive, createSelectInteractive, createModifyInteractive, createMoveInteractive, createDrawInteractive } from '@web-map-service/map2d'

  const state = reactive({
    draw: false,
    drawType: 'circle',
    select: false,
    move: false,
    modify: false,
    measure: false,
    measureType: 'distance',
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [draw, select, move, modify, measure] = []

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
      case 'select': 
        select.enable()
        break
      case 'move': 
        move.enable()
        break
      case 'modify': 
        modify.enable()
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
      case 'select': 
        select.close()
        break
      case 'move': 
        move.close()
        break
      case 'modify': 
        modify.close()
        break
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

    const layer = map.container.layerManager.create()

    interactiveManager = map.interactiveManager;
    draw = createDrawInteractive(interactiveManager)
    select = createSelectInteractive(interactiveManager)
    move = createMoveInteractive(interactiveManager)
    modify = createModifyInteractive(interactiveManager)
    measure = createMeasureInteractive(interactiveManager)

    const element4 = layer.create({
      type: 'image',
      style: {
        stroke: {
          color: 'red'
        }
      },
      rotate: 30,
      image: {
        src: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/position.png'
      },
      data: [6000, 6000]
    })

    map.emitter.on('select', (data: Element[])=>{
      // 获取所有的选择元素
      move.clean()
      modify.clean()
      for (const item of data) {
        move.add(item)
        modify.add(item)
      }
    })

    changeDrawType(state.drawType)
    changeMeasureType(state.measureType)
    map.emitter.on('draw', (data: PointData)=>{
      // 把绘制的元素生成到相应图层
      layer.create(data)
    })
  })
</script>