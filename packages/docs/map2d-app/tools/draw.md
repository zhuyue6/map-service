# draw
 draw提供绘制应用元素能力，元素插件，通过draw反射回调
```ts
  const { draw } = tools
  draw.enable()
```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |
| use | DrawType  |  是  |  切换绘制类型   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| draw | Element[]   |  绘制结束后的反射事件  |

```ts
  app.emitter.on('draw', (elements: Element[]) => {
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2 items-center">
      <el-select :modelValue="state.drawType" @change="changeDrawType">
        <el-option value="ap" label="ap"></el-option>
      </el-select>
      <el-button class="ml-2 " @click="switcher('draw', !state.draw)" type="primary">{{ `${state.draw ? '关闭': '启用'} draw插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp, elements } from '@web-map-service/map2d-app'

  const state = reactive({
    draw: false,
    drawType: 'ap',
  })

  const mapRef = ref()

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


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    draw = app.tools.draw
    changeDrawType(state.drawType)
  })

</script>