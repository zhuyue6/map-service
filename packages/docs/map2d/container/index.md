# Container

container 包含 baseMap 和 layerManage 两项  
baseMap 底图设置  
layerManage 创建图层， 图层创建服务元素

## 演示

<div class="w-[500px] h-[700px]">
  <div class="flex w-full">
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="addPolygon">添加多边形元素</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="addLine">添加线段元素</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="addCircle">添加圆形元素</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="addImage">添加图片元素</el-button>
    </div>
    <div class="flex mb-2">
      <el-button class="mr-2" size="small" @click="clean">清空元素</el-button>
    </div>
  </div>
  <div class="w-[500px] h-[500px] border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap } from "@web-map-service/map2d";
  import { ref, onMounted, reactive } from 'vue'

  const mapRef = ref<HTMLElement>()
  let layer
  function addPolygon() {
    let data = []
    for (let i = 0;  i < 4; i++ ) {
      data.push([Math.random() * 10000, Math.random() * 10000])
    }
    const elementPolygon = layer.create({
      type: 'polygon',
      data
    })
  }

  function clean() {
    layer.clean()
  }

  function addLine() {
    let data = []
    for (let i = 0;  i < 3; i++ ) {
      data.push([Math.random() * 10000, Math.random() * 10000])
    }
    const elementLine = layer.create({
      type: 'line',
      style: {
        stroke: {
          color: 'pink',
          width: 2
        }
      },
      data
    })
  }

  function addCircle() {
    const elementCircle = layer.create({
      type: 'circle',
      style: {
        stroke: {
          color: 'blue',
          width: 2
        }
      },
      data: {
        center: [Math.random()* 10000, Math.random()* 10000],
        radius: Math.random()* 1000
      }
    })
  }

  function addImage() {
    const elementCircle = layer.create({
      type: 'image',
      image: {
        src: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/position.png',
      },
      data: [Math.random()* 10000, Math.random()* 10000],
    })
  }

  onMounted(()=> {
    const map = createMap({
      el: mapRef.value,
    })
  
    layer = map.container.layerManager.create({
      type: 'test'
    })
  
    const elementPolygon = layer.create({
      type: 'polygon',
      rotate: 30,
      data: [[2000, 4000], [3000, 4000], [3000, 3000], [2000, 2000]]
    })
    const elementLine = layer.create({
      type: 'line',
      data: [[7000, 4000], [6000, 4000], [3000, 6000], [2000, 2000]]
    })
    const elementCircle = layer.create({
      type: 'circle',
      rotate: 30,
      data: {
        center: [6000, 6000],
        radius: 600
      }
    })
    const elementImage = layer.create({
      type: 'image',
      rotate: 30,
      image: {
        src: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/position.png',
        width: 60,
        height: 60
      },
      data: [5000, 6000]
    })
  })
</script>