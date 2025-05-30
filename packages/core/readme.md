# web 地图服务

分别为2D地图和3D地图服务，目前已经完成的是2d地图  

2D地图包括地图服务和地图应用，以下是2D地图的架构图设计图：  

## 架构图

![架构图](https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map2d_framework.png)

## 地图组成

地图服务包括7大模块： 视图、渲染器、动画、生命周期、容器、交互、事件  

地图应用包括3大模块：工具插件、元素插件、通用地图  

[地图api：https://zhuyue6.github.io/web-map-service/](https://zhuyue6.github.io/web-map-service/)

## 安装

```js
  npm i web-map-service
```

## 创建一个地图服务

```js
  import '@web-map-service/map2d/style.css'
  import { map2d } from 'web-map-service'
  const map = map2d.createMap({
    el: 'app',
    baseMap: {
      url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
    }
  })
  // 创建图层
  const layer = map.container.layerManager.create({
    type: 'test1',
  })

  const element = layer.create({
    type: 'polygon',
    rotate: 59,
    data: [[100, 100], [2000, 100], [2000, 2000], [100, 10000]]
  })

```

## 创建一个地图应用

```js
  import '@web-map-service/map2d/style.css'
  import { map2dApp } from 'web-map-service'
  
  const app = map2dApp.createApp({
    el: 'app',
    baseMap: {
      url: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/map.jpg'
    }
  })

  app.element.create({
    type: 'ap',
    data: {
      center: [3000, 4000],
      radius: 1000
    }
  })

```