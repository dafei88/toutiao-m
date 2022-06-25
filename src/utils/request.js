/**
 * 请求模块
*/
import axios from 'axios'
// axios.create(config)根据指定配置创建一个新的axios
const request = axios.create({
  // 接口的基准路径
  baseURL: 'api'
})
// 请求拦截器
// 响应拦截器
export default request
