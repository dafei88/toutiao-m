import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式
import './styles/index.less'
// 导入Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.config.productionTip = false

// 注册Vant组件库
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
