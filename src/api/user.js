// 用户相关请求模块
import request from '@/utils/request.js'
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: data
  })
}
// 发送验证码 每分钟只能请求一次
export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}
// 获取用户的频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
// 关注用户
export const addFollow = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}
// 取消关注用户
export const cancelFollow = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
