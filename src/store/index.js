import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'
// 实际上是调用了vuex中的一个install方法
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // user是一个对象，用来存储当前登录用户信息（包含token等数据）
    user: getItem(TOKEN_KEY)
  },
  getters: {
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 当我们刷新页面时，vuex容器中的数据会被初始化，进而会导致存储到vuex容器中的数据丢失。解决办法： 把存储到的数据备份一份到本地存储
      // 这里只把state.user中的数据备份一份到本地存储。
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
