import Cookies from 'js-cookie'

const TokenKey = 'ihrm_token' // 设置一个独一无二的key
const TimeKey = 'ihrm_timestamp-key' // 这是一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}

// 读取时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}
