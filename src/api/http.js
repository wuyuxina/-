// import { createApp } from "vue";
import axios from 'axios'
import router from '../router'
// import { Loading, Message, MessageBox } from 'element-ui'
import { removeToken } from './auth.js'

const target = process.env.TARGET

/**
 * 设置全局遮罩
 */
let  zkrLoading=null // 定义遮罩变量

// 开启遮罩（element的遮罩）
function startZkrLoading() {
//   var loading = layer.load(2, {
//     shade: 0.3,
// });
  // zkrLoading = Loading.service({
  //   lock: true,
  //   spinner: 'el-icon-loading',
  //   text: '数据加载……',
  //   background: 'rgba(0,0,0,.3)'
  // })
  console.log('开启遮罩')
}

// 关闭遮罩（element的遮罩）
function endZkrLoading() {
  // zkrLoading.close()
  console.log('关闭遮罩')
}

/**
 * 根据请求情况显示全屏遮罩
 */
let zkrAllRequestCount = 0 // 同一时刻所有的请求数量

export function showZkrLoading() {
  if (zkrAllRequestCount === 0) {
    startZkrLoading()
  }

  zkrAllRequestCount++
}

export function hideZkrLoading() {
  if (zkrAllRequestCount <= 0) {
    zkrAllRequestCount = 0;
    return;
  }

  zkrAllRequestCount--

  if (zkrAllRequestCount === 0) {
    endZkrLoading()
  }
}

/**
 * 配置axios
 */
axios.defaults.timeout = 120000 // 超时时间
axios.defaults.baseUrl = target // 后台请求地址

// 添加request拦截器
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.common['X-Token'] = token
  }

  showZkrLoading() // 显示遮罩
  return config
}, error => {
  return Promise.reject(error.response);
})

// 添加response拦截器
let tokenStatus = true // 401/403状态只提示一次
axios.interceptors.response.use(
  response => {

    if (response.status === 200) {
			tokenStatus = true
      hideZkrLoading() // 关闭遮罩
    }
    return Promise.resolve(response);
  },
  error => {
    hideZkrLoading() // 关闭遮罩

    /**
     * 根据错误信息给予提示
     */
    if (error.response && error.response.data) {
      let code = error.response.data.code // 状态

      switch (code) {
        case 401: case 403://缺少token，跳转到登录页
					if (tokenStatus) {
					  tokenStatus =  false
					
					  // MessageBox.confirm('登录信息失效，点击“确定”返回登录页', '提示', {
					  //   confirmButtonText: '确定',
					  //   cancelButtonText: '取消'
					  // }).then(() => {
					  //   // 点击确定，清除token跳转到登录页
					  //   let curPath = router.currentRoute.fullPath
					
					  //   removeToken()
					  //   if (curPath !== '/login') router.replace({ path: '/login' })
            // }).catch(() => {})

            // 点击确定，清除token跳转到登录页
					    let curPath = router.currentRoute.fullPath
              removeToken()
              
					    if (curPath !== '/login') {
                alert('token失效，跳转回登录页')
                router.replace({ path: '/login' })
              }
					}

          break
        case 404:
          // Message({
					// 	message: '网络请求不存在',
					// 	type: 'error'
          // })
          console.log('网络请求不存在')
          break
        default:
					// Message({
					// 	message: error.response.data.message,
					// 	type: 'error'
          // })
          console.log(error.response.data.message)
          break
      }
    } else {
      // 超时提示
      if (error.message.includes('timeout')) {
				// Message({
				// 	message: '请求超时',
				// 	type: 'error'
        // })
        console.log('请求超时')
      }
    }

    return Promise.reject(error)
  }
)

export default axios
