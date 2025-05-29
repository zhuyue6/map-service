# 插件注册

地图应用是使用插件系统去实现的，所以插件注册就是必不可少的一个流程，
插件注册通常使用的是app.use方法

```js
   app.use(plugin, pluginOptions)
```
也可以在创建应用的时候直接参数plugins选择注册初始化插件

```js
   import { createApp } from '@web-map-service/map2d-app'
   const app = createApp({
    plugins: [{
      type: 'ap'
    }]
   })
```


## 插件
插件是一个使用install属性的对象，app.use会执行该方法app作为参数传入  
type 属性是插件的类型标识  
插件可能存在uninstall 卸载逻辑  
depend 插件依赖的额外插件，插件类型数组如 ['ap']，存在该属性的时候会先去注册依赖插件，再判断依赖插件是否注册成功，若依赖成功注册便注册该插件，失败的话就相反

```ts

interface Plugin<T = null> {
  depend?: string[]
  type: string
  install(app: App, options?: any): App<T>
  uninstall?(): void
}

```

## 默认插件注册

不传参的情况默认注册所有工具插件与元素插件，相关逻辑再setup/plugin.ts中

```ts
interface PluginOptions {
  type: string,
  options?: Record<string, unknown>
}

// 默认需要启动的元素插件
const initElementsPluginsOptionsList: PluginOptions[] = [{
  type: 'ap'
}]

// 默认需要启动的工具插件
const initToolsPluginsOptionsList: PluginOptions[] = [{
  type: 'measure'
}, {
  type: 'draw'
}, {
  type: 'select'
}, {
  type: 'move'
}, {
  type: 'modify'
}, {
  type: 'edit'
}]

```