# edit
edit是整合了select/move/modify 提供应用元素编辑的能力，通过edit反射回调
```ts
  const { edit } = tools
  edit.enable()
```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| edit | Element[]   |  编辑结束后的反射事件  |

```ts
  app.emitter.on('edit', (elements: Element[])=>{
    console.log(elements)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('edit', !state.edit)" type="primary">{{ `${state.edit ? '关闭': '启用'} edit插件`}}</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from 'web-map-service'

  const state = reactive({
    edit: false,
  })

  const mapRef = ref()

  let [edit, select] = []

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'edit': 
        edit.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'edit': 
        edit.close()
        break
    }
    state[type] = false
  }


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    edit = app.tools.edit
    app.element.create({
      type: 'ap',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })
  })

</script>