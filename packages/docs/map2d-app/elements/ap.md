# 自定义ap插件

元素插件中注入了自定义的ap应用元素的功能, 提供ap应用元素的操作处理

```js
   element.create({
    type: 'ap',
    data: [{
      center: [3000, 3000],
      radius: 1000
     }]
   })

```

## 演示

<div class="flex">
  <el-select v-model="state.selected" class="w-[300px] mb-2 mr-2">
    <el-option :value="item.value" :key="item.value" v-for="item of state.options"></el-option>
  </el-select>

  <el-button type="primary" @click="create">创建</el-button>
</div>
<div class="w-[500px] h-[500px] border-[1px] border-solid" ref="mapRef"></div>

<script setup>
  import { createApp, createApPlugin } from '@web-map-service/map2d-app'
  import { onMounted, ref, reactive } from 'vue'

  const app = ref()

  const mapRef = ref()
  const state = reactive({
    selected: 'ap',
    options: [{
      value: 'ap'
    }]
  })

  function create() {
    let data = [
      [Math.random() * 10000, Math.random() * 10000]
      [Math.random() * 10000, Math.random() * 10000],
      [Math.random() * 10000, Math.random() * 10000],
      [Math.random() * 10000, Math.random() * 10000],
    ]
    if (['ap'].includes(state.selected)) {
      data = {
        center: [Math.random() * 10000, Math.random() * 10000],
        radius: Math.random() * 1000
      }
    }

    app.value.element.create({
      type: state.selected,
      data
    })
  }

  onMounted(()=>{
    app.value = createApp({
      el: mapRef.value,
      baseMap: {
        url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
      },
    })
    app.value.use(createApPlugin())
  })

</script>