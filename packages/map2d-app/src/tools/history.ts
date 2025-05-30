import { App, Plugin } from '../types';
import { Element } from '../elements/types';
import { getElementBySElement } from '../elements/element';
import { util } from '../shared';

// 监听element:created、element:removed、element:updateBefore来对状态做处理
// 历史插件只对元素操作【新增、修改、删除】处理

interface State {
  type: 'add' | 'update' | 'remove';
  element: Element;
  rawData?: Element['data'];
  data?: Element['data'];
  rawStyle?: Element['style'];
  style?: Element['style'];
  rawName?: Element['name'];
  name?: Element['name'];
  rawRotate?: Element['rotate'];
  rotate?: Element['rotate'];
}

type ActionType = 'forward' | 'back';

function addElement(app: App, state: State) {
  app.element.add(state.element);
}

function removeElement(app: App, state: State) {
  app.element.remove(state.element);
}

function updateElement(app: App, state: State, useRaw = false) {
  // 如果是元素修改的话进行元素修改
  // 应该要保留原始的数据
  const element = getElementBySElement(app, state.element.getSElement())!;
  if (state.data) {
    // 数据更新
    const rawData = state.rawData!;
    const data = state.data;
    element.setData(!useRaw ? data : rawData);
  }
  if (state.style) {
    // 样式更新
    const rawStyle = state.rawStyle!;
    const style = state.style;
    element.setStyle(!useRaw ? style : rawStyle);
  }
  if (state.name) {
    // 名称更新
    const rawName = state.rawName!;
    const name = state.name;
    element.setName(!useRaw ? name : rawName);
  }
  if (state.rotate) {
    // 角度更新
    const rawRotate = state.rawRotate!;
    const rotate = state.rotate;
    element.setRotate(!useRaw ? rotate : rawRotate);
  }
  return element;
}

function makeTool(app: App) {
  let stateStack: State[] = [];
  // 最大历史长度
  const max = 50;
  // 当前指针
  let pointer = -1;
  // 历史插件回溯进行中
  let pending = false;

  function pushState(state: State) {
    // 如果状态栈的长度超限，则移除第一个栈元素，并栈尾追加一个新元素
    if (stateStack.length >= max) {
      stateStack.shift();
      stateStack.push(state);
      return;
    }
    stateStack.push(state);
    pointer++;
  }

  function useState(actionType: ActionType) {
    // 启用当前的状态，前进是应用动作，后退是撤销动作
    pending = true;
    const state = stateStack[pointer];
    let element = state.element;
    if (
      (actionType === 'forward' && state.type === 'add') ||
      (actionType === 'back' && state.type === 'remove')
    ) {
      // 如果是前进操作，当前步骤是新增元素调用元素创建
      // 如果是后退操作，当前步骤是移除元素，就新增该元素
      addElement(app, state);
    } else if (
      (actionType === 'forward' && state.type === 'remove') ||
      (actionType === 'back' && state.type === 'add')
    ) {
      // 如果是前进操作，当前步骤是移除元素调用元素移除
      // 如果是后退操作，当前步骤是新增元素，就移除该元素
      removeElement(app, state);
    } else if (state.type === 'update') {
      // 当前步骤是修改元素
      // 如果是前进操作，则使用最新数据
      // 如果是后退操作，则使用raw数据
      if (actionType === 'forward') {
        element = updateElement(app, state, false);
      } else {
        element = updateElement(app, state, true);
      }
    }
    app.emitter.emit('history', {
      max,
      pointer,
      type: state.type,
      element,
      data: state.data,
    });
    pending = false;
  }

  function addedEmitter(element: Element) {
    if (pending) return;
    const state: State = {
      type: 'add',
      element,
    };
    pushState(state);
  }

  function updateBeforeEmitter({ element, data, style, rotate, name }: State) {
    if (pending) return;
    const state: State = {
      type: 'update',
      element,
      rawData: util.deepCopy(element.data),
      data: util.deepCopy(data),
      rawStyle: util.deepCopy(element.style),
      style,
      rawName: util.deepCopy(element.name),
      name,
      rawRotate: util.deepCopy(element.rotate),
      rotate,
    };
    pushState(state);
  }

  function removeEmitter(element: Element) {
    if (pending) return;
    const state: State = {
      type: 'remove',
      element,
    };
    pushState(state);
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return;
      // 监听元素创建上图
      app.emitter.on('element:added', addedEmitter);
      // 监听元素移除
      app.emitter.on('element:removed', removeEmitter);
      // 监听元素更改
      app.emitter.on('element:updateBefore', updateBeforeEmitter);
      tool.enabled = true;
    },
    close() {
      if (!tool.enabled) return;
      app.emitter.remove('element:added', addedEmitter);
      app.emitter.remove('element:removed', removeEmitter);
      app.emitter.remove('element:updateBefore', updateBeforeEmitter);
      tool.enabled = false;
    },
    forward() {
      // 指针不能大于状态的长度
      if (pointer === stateStack.length - 1) return;
      pointer++;
      useState('forward');
    },
    back() {
      // 指针-1时直接跳出
      if (pointer === -1) return;
      useState('back');
      pointer--;
    },
    clean() {
      stateStack = [];
    },
  };
  return tool;
}

export function createPlugin() {
  let app: App;
  const plugin: Plugin = {
    type: 'history',
    install(_app: App) {
      app = _app;
      app.tools.history = makeTool(app);
      return app;
    },
  };
  return plugin;
}

declare module './tool' {
  interface Tools {
    history: ReturnType<typeof makeTool>;
  }
}
