# Layer
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
        src: 'https://raw.githubusercontent.com/zhuyue6/web-map-service/main/publichttps://raw.githubusercontent.com/zhuyue6/web-map-service/main/public/images/position.png'
      },
      data: [6000, 6000]
    })

```

**事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| create      |  ElementOptions   |     否      |  创建元素 |
| add   | Element  |   是     | 添加元素 |
| remove   | Element   |   是   | 移除元素 |
| clean   |  undefined  |     否      | 清空所有元素 |
| destroy   |  undefined  |     否      | 销毁图层 |
| getElements   |  undefined  |     否      | 获取所有元素 |
| getElementById   |  number  |     是      | 由id获取元素 |