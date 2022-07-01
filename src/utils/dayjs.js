// 导入vue ：这里是为了创建一个全局过滤器
import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
// dayjs默认语言是英文，加载中文语言包
import 'dayjs/locale/zh-cn'
// 导入relativeTime 插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 使用relativeTime插件
dayjs.extend(relativeTime)
// 全局使用
dayjs.locale('zh-cn')
// dayjs()获取当前最新时间
// dayjs().format('YYYY-MM-DD') 按指定格式输出当前最新时间
dayjs().format('YYYY-MM-DD')
// 33年前
dayjs().to(dayjs('1990-01-01'))
// 几秒前
dayjs().fromNow()

// 定义一个全局过滤器，然后就可以在任一组件的模板内使用，该过滤器就相当于一个全局可用的方法。
// 参数1：过滤器名称
// 参数2：过滤器函数
// 使用方式： {{ 表达式 | 过滤器名称 }}
// 过滤器函数的参数是表达式的结果
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
