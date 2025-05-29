import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/map',
    component: () => import('../pages/map/index.vue'),
    // component: () => import('../pages/layout.vue'),
    // redirect: '/map',
    // children: [
    //   {
    //     path: '/map',
    //     name: 'map',
    //     component: () => import('../pages/map.vue'),
    //   }
    // ]
  },
  {
    path: '/',
    redirect: '/map'
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
