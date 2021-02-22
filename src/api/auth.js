
// const proName = process.env.PRO_NAME

/**
 * 清除浏览器用户信息缓存
 */
export function removeToken() {
  localStorage.removeItem('token')
}
