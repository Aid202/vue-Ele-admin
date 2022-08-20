// 权限拦截在路由跳转执行 ==> 导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例，和组件中的 this.$store一回事
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 不需要导出，因为只需要代码执行即可

const whiteList = ['/login', '/404'] // 定义白名单

// 前置守卫
// to 到哪里去
// from 从哪里来
// next 是前置守卫必须执行的钩子  next必须执行
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async(to, from, next) => {
  nProgress.start() // start 开启进度条
  // 判断是否有 token
  if (store.getters.token) {
    // 只有有 token 才能获取 资料
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登录页 (/login) 跳转至 主页
      next('/') // 跳转至主页
    } else {
      // 只有放过，才获取用户资料
      if (!store.getters.userId) {
        // 如果没有 id 表示没有获取过用户资料
        await store.dispatch('user/getUserInfo')
        // 如果后续需要根据用户资料获取数据 必须改成 同步
      }
      next() // 不去理会，留在原地
    }
  } else {
    // 没有 token 的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 要去的地址在白名单
      next() // 不去理会，留在原地
    } else {
      // 不在白名单
      next('/login')
    }
  }
  nProgress.done() // 手动关闭，解决手动切换地址时，进度条不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  nProgress.done() // 关闭进度条
})
