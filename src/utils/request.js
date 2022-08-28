import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600 // 定义超时时间
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
    // 只有在有 token 的情况下,才有必要检查时间戳,是否超时
    if (IsCheckTimeOut()) {
      // 如果它为 true 表示过期了
      // token 超时,需要删除
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('登陆超时，请重新登录')
      return Promise.reject(new Error('token超时'))
    }
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
  // error 信息 里面 response的对象
  if (err.response && err.response.data && err.response.data.code === 10002) {
    // 当等于 10002 时,表示 服务器返回 token超时
    store.dispatch('user/logout') // 登出 actions 删除 token
    router.push('/login') // 跳转到主页
  } else {
    Message.error(err.Message) // 提示错误信息
  }
  return Promise.reject(err) // 返回执行错误，让当前的执行链跳出成功，直接执行catch
})

// 是否超时
// 当前时间 - 缓存中的时间 是否大于 时间差
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const TimeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - TimeStamp) / 1000 > TimeOut
}
// 导出 axios 实例
export default service
