# baseMap 

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
**参数**

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
**事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| getExtent      |  undefined   |     否      |  底图的url |
| setExtent   | [number, number, number, number]  |   是     | 底图的范围大小【单位米】 |
| setImage   | string   |   否   | 重新按当前范围设置底图图片 |
| getOlLayer   |  undefined  |     否      | 获取底图的ol图层 |

<div class="w-[500px] h-[700px]">
  <div class="w-full h-full border" ref="mapRef"></div>
</div>

<script setup lang="ts">
  import { createMap } from "web-map-service";
  import { ref, onMounted, reactive } from 'vue'

  const mapRef = ref<HTMLElement>()

  onMounted(()=> {
    const map = createMap({
      el: mapRef.value,
      baseMap: {
        url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg',
        extent: [0, 0, 5000, 5000]
      }
    })
  })
</script>