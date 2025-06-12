# rank
提供移动应用元素排列的能力，通过rank反射回调
```ts
  const { rank } = tools
  rank.enable()
  app.emitter.on('rank', (rankEmitter: RankEmitter) => {
  })

  interface RankEmitter {
    elements: Element[]
    type: RankType
    extreme: number
  }

  type RankType = 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY'

```

**事件**

| 事件      |   参数    |  是否必填   |     描述    |
| ---- | ---- | ---- | ---- |
| use | RankType  |  否  | 使用相应排列 |
| enable | undefined  |  否  |  启用  |
| close | undefined  | 否   |  关闭   |

**反射**

| 属性    |   参数    |    描述    |
| ---- | ---- | ---- |
| rank | RankEmitter   |  移动结束后的反射事件  |

```ts
  app.emitter.on('rank', (rankEmitter: RankEmitter)=>{
    console.log(rankEmitter)
  })
```

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full flex-col">
    <div class="flex mb-2">
      <el-button class="mr-2"  @click="switcher('rank', !state.rank)" type="primary">{{ `${state.rank ? '关闭': '启用'} rank插件`}}</el-button>
    </div>
    <div class="flex mb-2 items-center">
      <div class="flex w-[200px]">
        <el-button type="primary" @click="useAlign('left')">左对齐</el-button>
        <el-button type="primary" @click="useAlign('right')">右对齐</el-button>
        <el-button type="primary" @click="useAlign('top')">上对齐</el-button>
        <el-button type="primary" @click="useAlign('bottom')">下对齐</el-button>
        <el-button type="primary" @click="useAlign('centerX')">水平居中对齐</el-button>
        <el-button type="primary" @click="useAlign('centerY')">垂直居中对齐</el-button>
      </div>
    </div>

  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { createApp } from '@web-map-service/map2d-app'

  const state = reactive({
    rank: false,
  })

  const mapRef = ref()

  let [rank, move] = []

  function switcher(type, status) {
    if (status) {
      enable(type)
      return
    }
    close(type)
  }

  function enable(type) {
    switch(type) {
      case 'rank': 
        rank.enable()
        break
    }
    state[type] = true
  }

  function close(type) {
    switch(type) {
      case 'rank': 
        rank.close()
        break
    }
    state[type] = false
  }

  function useAlign(type) {
    rank.use(type)
  }

  onMounted(()=>{
    const app = createApp({
      el: mapRef.value
    })
    rank = app.tools.rank
    move = app.tools.move
    move.enable()
    enable('rank')
    app.emitter.on('rank', (data)=>{
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
      type: 'area',
      sElementType: 'rect',
      data: [[2000, 2000], [4000,2000], [4000, 4000], [2000, 4000]]
    })

    app.element.create({
      type: 'area',
      sElementType: 'polygon',
      data: [[6000, 5000], [6000,5500], [7000, 6000]]
    })
  })

</script>