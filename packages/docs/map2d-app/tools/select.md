# select
提供选中应用元素的能力，通过select反射回调
```ts
  const { select } = tools
  select.enable()
```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| select | Element[]   |  选中结束后的反射事件  |

```ts
  app.emitter.on('select', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('select', !state.select)" type="primary">{{ `${state.select ? '关闭': '启用'} select插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from 'web-map-service'

  const state = reactive({
    select: false,
  })

  const mapRef = ref()

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


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    select = app.tools.select
    app.element.create({
      type: 'ap',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })
  })

</script>