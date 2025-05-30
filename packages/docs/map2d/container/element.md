# Element
服务元素，地图上要素组成集合，目前包含圆形、多边形、正方形、线段、图片(目前是固定像素大小)

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


**事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| setRotate | number  |  是 |  设置旋转角度  |
| setStyle      |  Style   |     否      |  更新样式到到ol要素上 |
| setProps      |  Record<string, unknow>   |     否      |  添加属性到到ol要素上 |
| setData      |  CircleData | PointData   |     否      |  同步数据到ol要素上 |
| getOlFeature      |  undefined   |     否      |  获取ol要素 |