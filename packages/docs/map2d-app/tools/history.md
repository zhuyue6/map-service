# 历史插件
控制地图的回溯处理，让应用元素操作支持前进后退的功能
```ts
  const { history } = tools
  history.enable()
```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable |  undefined  |  否  |  启用插件 |
| close |  undefined  |  否  |  禁用插件 |
| forward |  undefined  |  否  |  前进 |
| back |  undefined  |  否  |  后退 |
| clean |  undefined  |  否  |  清空状态 |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| history | History   |  历史操作结束后的反射事件  |

```ts
  type History = {
    max: number,
    pointer: number,
    type: 'add' | 'update' | 'remove'
    element: Element,
    data?: Element['data']
    style?: Element['style']
    name?: Element['name']
    rotate?: Element['rotate']
  }

  app.emitter.on('history', (history: History) => {
    console.log(history)
  })
```


**图层操作的Element反射**  
图层在添加、删除、element时会触发回调、调用element更新方法会更新element回调，监听元素变化
```ts
  // 新增了元素element
  emitter.on('element:added', element)

  // 删除了元素element
  emitter.on('element:removed', element)

  // 更新元素element数据前
  emitter.on('element:updateBefore', { element, data, style, rotate, name })

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
      <el-button class="mr-2"  @click="historyHandle('forward')" type="primary">前进</el-button>
      <el-button class="mr-2"  @click="historyHandle('back')" type="primary">后退</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from 'web-map-service'

  let app 

  const state = reactive({
    draw: false,
    drawType: 'ap',
    edit: false,
  })

  const mapRef = ref()

  let [draw, edit, history] = []

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

  function historyHandle(type) {
    if (type === 'forward') {
      history.forward()
    } else if (type === 'back') {
      history.back()
    }
  }


  function enable(type) {
    switch(type) {
      case 'draw': 
        draw.enable()
        break
      case 'edit': 
        edit.enable()
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
    }
    state[type] = false
  }


  onMounted(()=>{
    app = createApp({
      el: mapRef.value
    })
    console.log(app.tools)
    draw = app.tools.draw
    edit = app.tools.edit
    history = app.tools.history
    history.enable()
    changeDrawType(state.drawType)
  })

</script>