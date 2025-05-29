import './styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router'

new Vue({
  el: '#app',
  components: {
    App
  },
  router,
  template: '<App/>'
})

Vue.use(ElementUI);
