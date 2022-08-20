/**
 * 快捷访问
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立 token 的快捷访问
  name: state => state.user.userInfo.username // 建立对于 用户名 的快捷访问
}
export default getters
