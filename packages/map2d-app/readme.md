# 2D地图应用

## 安装

```js
  npm i @web-map-service/map2d
  npm i @web-map-service/map2d-app
```

### 如何使用

```js
  import { createApp } from '@web-map-service/map2d-app'
  const app = createApp({
    el: '#app',
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


[查看2D地图 api](http://zhuyue6.github.io/web-map-service/)