import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import('@/views/login/index')
  }
]

const router = new VueRouter({
  routes
})

export default router
