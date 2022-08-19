import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken() // 设置token为共享状态，初始化vuex的时候，都从缓冲中读取
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给 vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  }
}
const actions = {
  async login(context, data) {
    // 调用 api 接口
    const result = await login(data)
    context.commit('setToken', result) // 提交mutation设置token
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
