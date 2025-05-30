# draw
提供绘制服务元素能力数据能力，通过改数据可以进行元素创建
```ts
  import { createDrawInteractive } from '@web-map-service/map2d'

  interface DrawInteractiveOptions {
    type: 'line' | 'circle' | 'polygon' | 'rect'
  }

  const draw = createDrawInteractive(map.interactiveManager, options as DrawInteractiveOptions)

  // 启用绘制
  draw.enable()
  // 绘制改用line类型
  draw.use({
    type: 'line'
  })
  type DrawEmitter = {
    type,
    data: drawData
  }
  map.emitter.on('draw', (data: DrawEmitter)=>{
    // 把绘制的元素生成到相应图层
    layer.create(data)
  })

```
**事件**
| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| enable    |  undefined  |     否      |  启动交互 |
| close    |  undefined  |     否      |  关闭交互 |
| use    |  DrawInteractiveOptions  |     是      |  更新绘制类型 |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| draw | DrawEmitter   |  选中结束后的反射事件  |

```ts
  type DrawEmitter = {
    type,
    data: drawData
  }
  map.emitter.on('draw', (draw: DrawEmitter)=>{
    console.log(draw)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2 items-center">
      <el-select :modelValue="state.drawType" @change="changeDrawType">
        <el-option value="circle" label="绘制圆形"></el-option>
        <el-option value="rect" label="绘制矩形"></el-option>
        <el-option value="polygon" label="绘制多边形"></el-option>
        <el-option value="line" label="绘制线段"></el-option>
      </el-select>
      <el-button class="ml-2 " @click="switcher('draw', !state.draw)" type="primary">{{ `${state.draw ? '关闭': '启用'} draw交互`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'
  import { createDrawInteractive } from '@web-map-service/map2d'

  const state = reactive({
    draw: false,
    drawType: 'circle',
  })

  const mapRef = ref<HTMLElement>()
  let map
  let interactiveManager

  let [draw] = []

  function changeDrawType(type) {
    state.drawType = type
    draw.use(type)
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
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'draw': 
        draw.close()
        break
    }
    state[type] = false
  }

  onMounted(()=> {
    map = createMap({
      el: mapRef.value,
    })

    interactiveManager = map.interactiveManager;
    draw = createDrawInteractive(interactiveManager)
    const layer = map.container.layerManager.create()
    changeDrawType(state.drawType)
    map.emitter.on('draw', (data)=>{
      // 把绘制的元素生成到相应图层
      layer.create(data)
    })
  })
</script>