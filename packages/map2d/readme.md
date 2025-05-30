# 2D地图服务

## 安装

```js
  npm i @web-map-service/map2d
```

### 如何使用

```js
  import { createMap } from '@web-map-service/map2d'
  const map = createMap({
    el: 'app',
    baseMap: {
      url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
    }
  })
  // 创建图层
  const layer = map.container.layerManager.create()

  const element = layer.create({
    type: 'polygon',
    rotate: 59,
    data: [[100, 100], [2000, 100], [2000, 2000], [100, 10000]]
  })
```


[查看2D地图 api](http://zhuyue6.github.io/web-map-service/)