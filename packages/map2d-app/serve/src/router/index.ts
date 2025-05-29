import vueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(vueRouter)

const router = new vueRouter({
  mode: 'history',
  routes: [
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
      path: '*',
      redirect: '/map'
    }
  ]
})

export default router
