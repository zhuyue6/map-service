# move
add方法提供移动应用元素的能力，通过move反射回调，通常是配合选择插件一起使用
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

```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| add | Element  |  是  |  添加元素为移动元素  |
| remove | Element  |  是  |  移除移动元素  |
| clean | undefined  |  否  |  清空移动元素 |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| move | Element[]   |  移动结束后的反射事件  |

```ts
  app.emitter.on('move', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('move', !state.move)" type="primary">{{ `${state.move ? '关闭': '启用'} move插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'

  const state = reactive({
    move: false,
  })

  const mapRef = ref()

  let [move, select] = []

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


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    move = app.tools.move
    select = app.tools.select
    select.enable()
     app.emitter.on('select', (elements)=>{
      move.clean()
      for (const element of elements) {
        move.add(element)
      }
    })
    app.element.create({
      type: 'ap',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })
  })

</script>