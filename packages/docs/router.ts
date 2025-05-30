interface Router {
  text?: string;
  link?: string;
  collapsed?: boolean
  items?: Router[];
}

const router: Router[] = [
  {
    text: '2D地图架构图',
    link: 'framework/map2d'
  },
  {
    text: '2D地图应用',
    items: [
      { text: '介绍', link: 'map2d-app/index' },
      { text: '插件注册', link: 'map2d-app/pluginRegister' },
      { 
        text: '元素插件',
        link: 'map2d-app/elements/index',
        collapsed: false,
        items: [
          { text: 'AP插件', link: 'map2d-app/elements/ap'},
        ],
      },
      { 
        text: '工具插件', 
        link: 'map2d-app/tools/index', 
        collapsed: false,
        items: [
          { text: '绘图插件', link: 'map2d-app/tools/draw'},
          { text: '选择插件', link: 'map2d-app/tools/select' }, 
          { text: '移动插件', link: 'map2d-app/tools/move' },
          { text: '修改插件', link: 'map2d-app/tools/modify' },
          { text: '编辑插件', link: 'map2d-app/tools/edit' },
          { text: '测量插件', link: 'map2d-app/tools/measure' },
          { text: '历史插件', link: 'map2d-app/tools/history' },
        ],
      },
    ],
  },
  {
    text: '2D地图服务',
    items: [
      { text: '介绍', link: 'map2d/index' },
      { text: '地图', link: 'map2d/map' },
      { 
        text: '容器',
        link: 'map2d/container/index',
        items: [
          { text: '底图', link: 'map2d/container/baseMap'},
          { text: '图层管理器', link: 'map2d/container/layerManager' }, 
          { text: '图层', link: 'map2d/container/layer' },
          { text: '元素', link: 'map2d/container/element' },
        ],
      },
      { text: '视图', link: 'map2d/view' },
      { 
        text: '交互', 
        link: 'map2d/interactive/index',
        collapsed: false,
        items: [
          { text: '绘图交互', link: 'map2d/interactive/draw'},
          { text: '选择交互', link: 'map2d/interactive/select' }, 
          { text: '移动交互', link: 'map2d/interactive/move' },
          { text: '修改交互', link: 'map2d/interactive/modify' },
          { text: '测量交互', link: 'map2d/interactive/measure' },
        ],
      },
    ],
  },
];

export default router;
