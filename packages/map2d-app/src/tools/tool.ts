import { type App, type Plugin } from '../types'

export function closeTools(app: App) {
  for (const tool of Object.values(app.tools)) {
    tool.close()
  }
}



/**
 * 
 * 工具插件, 提供工具能力
 */
export function createPlugin() {
  let app: App
  const plugin: Plugin = {
    type: 'tool',
    install(_app: App) {
      app = _app
      app.tools = {} as Tools
      
      return app
    }
  }
  return plugin
}

export interface Tools {}


declare module '../types' {
  interface ComponentCustomProperties {
    tools: Tools;
  }
}