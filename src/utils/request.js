/**
 * 请求模块
*/
import axios from 'axios'
import store from '@/store/index'
// JSONBig可以处理超出JavaScript安全整数范围的问题
import JSONBig from 'json-bigint'
// axios.create(config)根据指定配置创建一个新的axios
const request = axios.create({
  // 接口的基准路径
  baseURL: 'api',
  // 自定义处理后端返回的原始数据
  transformResponse: [function (data) {
    try {
      // 会自动把响应数据data中的超出JavaScript安全整数范围的数据转化为BigNumber类型的对象
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})
// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 如果请求出错 导致没有发送出去  会进入到这里
  return Promise.reject(error)
})
// 响应拦截器
export default request
