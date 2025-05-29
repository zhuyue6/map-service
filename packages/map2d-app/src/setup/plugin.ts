import { createElementPlugin, createApPlugin } from '../elements'
import { createToolPlugin } from '../tools'
import { createPlugin as createMeasurePlugin } from '../tools/measure'
import { createPlugin as createDrawPlugin } from '../tools/draw'
import { createPlugin as createSelectPlugin } from '../tools/select'
import { createPlugin as createMovePlugin } from '../tools/move'
import { createPlugin as createModifyPlugin } from '../tools/modify'
import { createPlugin as createEditPlugin } from '../tools/edit'
import { createPlugin as createHistoryPlugin } from '../tools/history'
import { App, PluginOptions, Plugin } from '../types'

// 插件与插件的映射
const pluginsMap = {
  ap: createApPlugin(),
  measure: createMeasurePlugin(),
  draw: createDrawPlugin(),
  select: createSelectPlugin(),
  move: createMovePlugin(),
  modify: createModifyPlugin(),
  edit: createEditPlugin(),
  history: createHistoryPlugin()
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
}, {
  type: 'history'
}]

function checkDependPluginRegister(app: App, depend: string[]): boolean {
  for (const pluginType of depend) {
    const plugin = app.getPluginByType(pluginType)
    if (!plugin) return false
  }
  return true
}

export function dependPluginRegister(app: App, plugin: Plugin, options: PluginOptions): boolean {
  if (plugin.depend && plugin.depend.length > 0) {
    for (const pluginType of plugin.depend) {
      const plugin = pluginsMap[pluginType as keyof typeof pluginsMap]
      // 这里不做判断是否注册插件，直接注册，app.use里会判断是否重复注册
      if (plugin) app.use(plugin, options)
    }
    // 检查一下依赖插件是否注册成功
    const dependPluginRegister = checkDependPluginRegister(app, plugin.depend)
    // 如果依赖插件未注册成功，直接跳过，放弃注册该插件
    return dependPluginRegister
  }
  return true
}

export function register(app: App, options?: PluginOptions[]) {
  // 需要注入的应用，本次按静态方式进行注册（把已有的静态），如有动态注册需求再调整
  // 先使用传入插件，没有传入再使用默认插件
  const pluginOptionsList = options ?? initElementsPluginsOptionsList.concat(initToolsPluginsOptionsList)
  app.use(createElementPlugin())
  app.use(createToolPlugin())
  for (const pluginOptions of pluginOptionsList) {
    const plugin = pluginsMap[pluginOptions.type as keyof typeof pluginsMap]
    app.use(plugin, options)
  }
}