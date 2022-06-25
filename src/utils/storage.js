/**
 * 封装本地存储的操作模块
 */
// 存储数据
export const setItem = (key, value) => {
  // 如果value是对象类型或数组类型, 则需要将value转化为json格式的字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    //  JSON.parse(data) 解析json格式的字符串 如果data是json格式的字符串，则将data转化为对象类型；如果data不是json格式的字符串，则报错
    return JSON.parse(data)
  } catch (error) {
    // 如果data不是json格式的字符串，则返回data
    return data
  }
}

// 删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
