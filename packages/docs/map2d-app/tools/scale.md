# scale
按地图extent大小比例适配地图的能力，通过scale反射回调
```ts
  const { scale } = tools
  scale.enable()

  type Range = [number, number]
  type Scale = number
  type ScaleEmitter = {
    scale: Scale
    range: Range
  }

  app.emitter.on('scale', (data: ScaleEmitter)=>{

  })

```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| setView | Range  |  是  |  按比例设置最大最小缩放  |
| fit | Scale  |  是  |  以当前地图extent按比例适应屏幕  |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| scale | ScaleEmitter  |  缩放事件触发的反射事件  |

```ts
  app.emitter.on('scale', (data: ScaleEmitter)=>{
    console.log(data)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('scale', !state.scale)" type="primary">{{ `${state.scale ? '关闭': '启用'} scale插件`}}</el-button>
    </div>
    <div class="flex mb-2 items-center">
      <span class="w-[140px]">按比例适配屏幕：</span>
      <div class="w-[200px]">
        <el-select :modelValue="state.scaleValue" @change="changeScale">
          <el-option :value='0.5' label="0.5"></el-option>
          <el-option :value='1' label="1"></el-option>
          <el-option :value='2' label="2"></el-option>
        </el-select>
      </div>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'

  const state = reactive({
    scale: false,
    scaleValue: 1
  })

  const mapRef = ref()

  let [scale] = []

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function changeScale(data) {
    state.scaleValue = data
    scale.fit(data)
  }

  function enable(type) {
    switch(type) {
      case 'scale': 
        scale.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'scale': 
        scale.close()
        break
    }
    state[type] = false
  }


  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    scale = app.tools.scale

    app.emitter.on('scale', (data)=>{
      // console.log(data)
    })
    app.element.create({
      type: 'ap',
      data: {
        center: [5000, 5000],
        radius: 1000
      }
    })

    app.element.create({
      type: 'ap',
      data: {
        center: [7000, 7000],
        radius: 1000
      }
    })
  })

</script>