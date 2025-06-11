import { App, Plugin } from '../types';
import { Element } from '../elements/types';
import { ElementSetDataItem, ElementEmitter } from '../elements';
import { util } from '../shared';

// 监听elements:created、elements:removed、elements:update 来对状态做处理
// 历史插件只对元素操作【新增、修改、删除】处理

type StateItem = { 
  element: Element
  data?: ElementSetDataItem['data']
  rawData?: ElementSetDataItem['data']
}

interface State {
  type: 'add' | 'update' | 'remove';
  data: StateItem[]
}

type ActionType = 'next' | 'back';

function addElements(app: App, state: State) {
  const elements = state.data.map((item) => item.element)
  app.element.add(elements);
}

function removeElements(app: App, state: State) {
  const elements = state.data.map((item) => item.element)
  app.element.remove(elements);
}

function updateElements(app: App, state: State, useRaw = false) {
  // 如果是元素修改的话进行元素修改
  // 应该要保留原始的数据
  const elements: Element[] = []

  for (const item of state.data) {
    if (item.data?.data) {
      // 数据更新
      const rawData = item.rawData!.data!;
      const data = item.data!.data!;
      item.element.setData(!useRaw ? data : rawData);
    }
    if (item.data?.style) {
      // 样式更新
      const rawStyle = item.rawData!.style!;
      const style = item.data.style;
      item.element.setStyle(!useRaw ? style : rawStyle);
    }
    if (item.data?.name) {
      // 名称更新
      const rawName = item.rawData!.name!;
      const name = item.data.name;
      item.element.setName(!useRaw ? name : rawName);
    }
    if (item.data?.rotate) {
      // 角度更新
      const rawRotate = item.rawData!.rotate!;
      const rotate = item.data.rotate;
      item.element.setRotate(!useRaw ? rotate : rawRotate);
    }
    elements.push(item.element)
  }


  return elements;
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

    stateStack = stateStack.slice(0, pointer + 1)

    stateStack.push(state);
    pointer++;
  }

  function useState(actionType: ActionType) {
    // 启用当前的状态，前进是应用动作，后退是撤销动作
    pending = true;
    const state = stateStack[pointer];
    if (
      (actionType === 'next' && state.type === 'add') ||
      (actionType === 'back' && state.type === 'remove')
    ) {
      // 如果是前进操作，当前步骤是新增元素调用元素创建
      // 如果是后退操作，当前步骤是移除元素，就新增该元素
      addElements(app, state);
    } else if (
      (actionType === 'next' && state.type === 'remove') ||
      (actionType === 'back' && state.type === 'add')
    ) {
      // 如果是前进操作，当前步骤是移除元素调用元素移除
      // 如果是后退操作，当前步骤是新增元素，就移除该元素
      removeElements(app, state);
    } else if (state.type === 'update') {
      // 当前步骤是修改元素
      // 如果是前进操作，则使用最新数据
      // 如果是后退操作，则使用raw数据
      if (actionType === 'next') {
        updateElements(app, state, false);
      } else {
        updateElements(app, state, true);
      }
    }
    app.emitter.emit('history', {
      max,
      pointer,
      data: state.data,
      type: state.type
    });
    pending = false;
  }

  function addedEmitter(elements: Element[]) {
    if (pending) return;
   
    const data = []
    for (const element of elements) {
      data.push({
        element
      })
    }

    const state: State = {
      type: 'add',
      data,
    };
    pushState(state);
  }

  function updateEmitter(elementSetDataItems: ElementSetDataItem[]) {
    if (pending) return;

    const data = []

    for (const item of elementSetDataItems) {
      data.push({
        element: item.element,
        rawData: {
          data: util.deepCopy(item.element.data),
          style: util.deepCopy(item.element.style),
          name: util.deepCopy(item.element.name),
          rotate: util.deepCopy(item.element.rotate),
        },
        data: item.data
      })
    }

    const state: State = {
      type: 'update',
      data
    };

    pushState(state);
  }

  function removeEmitter(elements: Element[]) {
    if (pending) return;

    const data = []
    for (const element of elements) {
      data.push({
        element
      })
    }

    const state: State = {
      type: 'remove',
      data,
    };
    pushState(state);
  }

  const tool = {
    enabled: false,
    enable() {
      if (tool.enabled) return;
      // 监听元素创建上图
      app.emitter.on(ElementEmitter.add, addedEmitter);
      // 监听元素移除
      app.emitter.on(ElementEmitter.remove, removeEmitter);
      // 监听元素修改
      app.emitter.on(ElementEmitter.update, updateEmitter);
      tool.enabled = true;
    },
    close() {
      if (!tool.enabled) return;
      app.emitter.remove(ElementEmitter.add, addedEmitter);
      app.emitter.remove(ElementEmitter.remove, removeEmitter);
      app.emitter.remove(ElementEmitter.update, updateEmitter);
      tool.enabled = false;
    },
    next() {
      // 指针不能大于状态的长度
      if (pointer === stateStack.length - 1) return;
      pointer++;
      useState('next');
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

declare module '../types' {
  interface AppEmitterEvent {
    history: any
  }
}