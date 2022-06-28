import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: () => import('@/views/layout/index'),
    children: [
      {
        path: '/home', // 什么都不写时  代表默认匹配的子路由
        name: 'home',
        component: () => import('@/views/home/index')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/index')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/index')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/index')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
