import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态，初始化vuex的时候，都从缓冲中读取
  userInfo: {} // 定义一个空对象 设置为null 会引起异常报错
}
const mutations = {
  // 设置 token
  setToken(state, token) {
    state.token = token // 将数据设置给 vuex
    // 同步给缓存
    setToken(token)
  },
  // 删除 token
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  },
  // 设置用户信息
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result
    // state.userInfo = {...result} // 浅拷贝
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用 api 接口
    const result = await login(data)
    context.commit('setToken', result) // 提交mutation设置token
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result) // 提交到 mutations
    return result // 为后期做权限留下伏笔
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
