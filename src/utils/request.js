import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
// 创建一个 axios 实例
const service = axios.create({
  // 当执行 npm run dev ==> .env.development => /api ==> 触发跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api npm run build => /prod-api
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入 token
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据 success 成功与否， 决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经出错，进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, err => {
  Message.error(err.Message) // 提示错误信息
  return Promise.reject(err) // 返回执行错误，让当前的执行链跳出成功，直接执行catch
})
// 导出 axios 实例
export default service
