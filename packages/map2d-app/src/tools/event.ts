import MapBrowserEvent from 'ol/MapBrowserEvent';
import { App, Plugin } from '../types';

function makeTool(app: App) {
  const { emitter } = app.map;

  function clickEmit(event: MapBrowserEvent) {
    app.emitter.emit('click', event);
  }

  function moveEmit(event: MapBrowserEvent) {
    app.emitter.emit('move', event);
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return;
      tool.enabled = true;
      emitter.on('click', clickEmit);
      emitter.on('move', moveEmit);
    },
    close() {
      if (!tool.enabled) return;
      tool.enabled = false;
      emitter.remove('click', clickEmit);
      emitter.remove('move', moveEmit);
    },
  };
  return tool;
}

export function createPlugin() {
  let app: App;
  const plugin: Plugin = {
    type: 'event',
    install(_app: App) {
      app = _app;
      app.tools.event = makeTool(app);
      return app;
    },
  };

  return plugin;
}

declare module './tool' {
  interface Tools {
    event: ReturnType<typeof makeTool>;
  }
}

declare module '../types' {
  interface AppEmitterEvent {
    click: any
    move: any
  }
}