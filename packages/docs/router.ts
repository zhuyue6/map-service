interface Router {
  text?: string;
  link?: string;
  items?: Router[];
}

const router: Router[] = [
  {
    text: '2D地图应用',
    items: [
      { text: '介绍', link: 'map2d-app/index' },
      { text: '插件注册', link: 'map2d-app/pluginRegister' },
      { text: '元素插件', link: 'map2d-app/elementPlugin' },
      { text: '工具插件', link: 'map2d-app/toolPlugin', 
        items: [
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
      { text: '容器', link: 'map2d/container' },
      { text: '视图', link: 'map2d/view' },
      { text: '交互', link: 'map2d/interactive' },
    ],
  },
];

export default router;
