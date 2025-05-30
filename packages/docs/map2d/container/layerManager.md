# LayerManager
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

**事件**

| 事件      |    参数    |  是否必填   |     描述    |
| -----------  |  ----------|----------   | ----------- |
| create      |  LayerOptions   |     否      |  创建图层 |
| add   | Layer  |   是     | 添加图层 |
| remove   | Layer   |   是   | 移除图层 |
| clean   |  undefined  |     否      | 销毁所有图层 |
| destroy   |  undefined  |     否      | 销毁所有图层 |
| getLayers   |  undefined  |     否      | 获取所有图层（不包括底图） |
| getLayerById   |  number  |     是      | 由id获取图层 |
