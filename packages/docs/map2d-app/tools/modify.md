# modify
add方法提供修改应用元素的能力，通过modify反射回调，通常是配合选择插件一起使用
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

```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| add | Element  |  是  |  添加元素为修改元素  |
| remove | Element  |  是  |  移除修改元素  |
| clean | undefined  |  否  |  清空修改元素 |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| element:modify | Element[]   |  修改结束后的反射事件  |

```ts
  app.emitter.on('element:modify', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('modify', !state.modify)" type="primary">{{ `${state.modify ? '关闭': '启用'} modify插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'

  const state = reactive({
    modify: false,
  })

  const mapRef = ref()

  let [modify, select] = []

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


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    modify = app.tools.modify
    select = app.tools.select
    select.enable()
     app.emitter.on('select', (elements)=>{
      modify.clean()
      for (const element of elements) {
        modify.add(element)
      }
    })
    app.element.create({
      type: 'ap',
      data: {
        center: [7000, 7000],
        radius: 1000
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