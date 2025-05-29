# Container

container 包含 baseMap 和 layerManage 两项  
baseMap 底图设置  
layerManage 创建图层， 图层创建元素

## baseMap 

地图的底图，可以进行配置以及修改

```js
  const { baseMap }  =  container
  
```

创建地图的时候可以添加配置

```js
  const map = createMap({
    el: 'map',
    baseMap: BaseMapOptions
  })
  
```
**BaseMapOptions参数**

| 属性名称      |   类型          |  默认值    |  是否必填   |     描述    |
| -----------  | ----------------| ----------|----------   | ----------- |
| url      | string         | ''    |     否      |  底图的url |
| extent   | [number, number, number, number]  |  [0, 0, 10000, 10000]   |     否      | 底图的范围大小【单位米】 |

```js
  const map = createMap({
    el: 'map',
    baseMap: BaseMapOptions
  })

  const { container } = map
  const { baseMap } = container
  
```
**baseMap事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| getExtent      |  undefined   |     否      |  底图的url |
| setExtent   | [number, number, number, number]  |   是     | 底图的范围大小【单位米】 |
| setImage   | string   |   否   | 重新按当前范围设置底图图片 |
| getOlLayer   |  undefined  |     否      | 获取底图的ol图层 |

## LayerManager
图层管理器，负责图层的创建和删除等功能

```ts
  const { layerManager } = container

  interface LayerOptions {
    type?: string
    name?: string
  }
  const layerOptions: LayerOptions = {
    type: '1',
    name: '1'
  }
  const layer = layerManager.create(layerOptions)
  
```

**layerManager事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| create      |  LayerOptions   |     否      |  创建图层 |
| add   | Layer  |   是     | 添加图层 |
| remove   | Layer   |   是   | 移除图层 |
| clean   |  undefined  |     否      | 销毁所有图层 |
| destroy   |  undefined  |     否      | 销毁所有图层 |
| getLayers   |  undefined  |     否      | 获取所有图层（不包括底图） |
| getLayerById   |  number  |     是      | 由id获取图层 |

## Layer
图层，负责元素的创建和删除等功能

```ts
  interface Layer {
    id: number
    type?: string
    name?: string
    create<T extends keyof ElementPluginsMap>(options: ElementPluginsMap[T]['options'] & {
      type: T
    }): ReturnType<typeof createElement<T>>
    add(element: Element): void
    remove(element: Element): void
    clean(): void
    destroy(): void
    getElementById(elementId: number): Element | undefined
    getOlLayer(): OlLayer
    getElements(): Element[]
  }

  const layer: Layer = layerManager.create(layerOptions)
  
  interface CircleData {
    center: number[],
    radius: number
  }

  type PointData = Array<[number, number]>

  interface ElementOptions<D = any> {
    type: 'line' | 'circle' | 'polygon' | 'rect'
    name?: string
    data: CircleData | PointData
    style?: Style
  }

  const elementOptions: ElementOptions
  const element = layer.create(elementOptions)
  // 目前除了圆形是CircleData， 其余都是使用PointData

  // style 可以设置元素的样式
  interface StorkeStyle {
    color: string,
    width: number
  }

  interface FillStyle {
    color: string
  }

  export interface Style {
    stroke: StorkeStyle
    fill: FillStyle
  }

  const elementPolygon = layer.create({
    type: 'polygon',
    data: [[2000, 4000], [3000, 4000], [3000, 3000], [2000, 2000]],
    style: {
      stroke: {
        color: 'blue',
        width: 2
      }
    }
  })
  const elementLine = layer.create({
    type: 'line',
    data: [[7000, 4000], [6000, 4000], [3000, 6000], [2000, 2000]]
  })
  const elementCircle = layer.create({
    type: 'circle',
    data: {
      center: [6000, 6000],
      radius: 600
    }
  })
  const elementCircle = layer.create({
    type: 'circle',
    data: {
      center: [6000, 6000],
      radius: 600
    }
  })

  const elementImage = layer.create({
      type: 'image',
      style: {
        stroke: {
          color: 'red'
        }
      },
      image: {
        src: '/images/position.png'
      },
      data: [6000, 6000]
    })

```

**layer事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| create      |  ElementOptions   |     否      |  创建元素 |
| add   | Element  |   是     | 添加元素 |
| remove   | Element   |   是   | 移除元素 |
| clean   |  undefined  |     否      | 清空所有元素 |
| destroy   |  undefined  |     否      | 销毁图层 |
| getElements   |  undefined  |     否      | 获取所有元素 |
| getElementById   |  number  |     是      | 由id获取元素 |

## Element
元素，地图上要素组成集合，目前包含圆形、多边形、正方形、线段、图片(目前是固定像素大小)

```ts
  interface Element {
    layerId: number
    id: number
    type: string
    name?: string
    rotate?: number
    setName(name: string): void
    setRotate(rotate: number): void
    props: Record<string, unknow>
    setProps(props: Record<string, unknow>): void
    setData(data: CircleData | PointData): void
    data: CircleData | PointData
    style?: Style
    getOlFeature(): OlFeature
  }

  const element: Element = layer.create(elementOptions)
```


**Element事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| setRotate | number  |  是 |  设置旋转角度  |
| setStyle      |  Style   |     否      |  更新样式到到ol要素上 |
| setProps      |  Record<string, unknow>   |     否      |  添加属性到到ol要素上 |
| setData      |  CircleData | PointData   |     否      |  同步数据到ol要素上 |
| getOlFeature      |  undefined   |     否      |  获取ol要素 |

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
        src: '/images/position.png',
      },
      data: [Math.random()* 10000, Math.random()* 10000],
    })
  }

  onMounted(()=> {
    const map = createMap({
      el: mapRef.value,
      baseMap: {
        url: '/images/map.jpg'
      }
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
        src: '/images/position.png',
        width: 60,
        height: 60
      },
      data: [5000, 6000]
    })
  })
</script>