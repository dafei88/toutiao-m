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
      // 这里只把state.user中的数据备份一份到本地存储。注意：本地存储只能存字符串，所以需要先把state.user对象转化为json格式的字符串 JSON.stringify(state.user)
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
