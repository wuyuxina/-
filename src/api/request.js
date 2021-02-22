import axios from './http.js'
// import { Message } from 'element-ui'

// 封装get请求
// params={} 是设置默认值
export function get(url, params = {}) {
  params.t = new Date().getTime(); // get方法加一个时间参数，解决ie下可能缓存问题
  return service({
    url: url,
    method: 'get',
    headers: {

    },
    params
  })
}

// 封装post请求
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      headers: {
        // 'Content-Type': 'application/json;chartset=UTF-8'
        'token':localStorage.getItem("token")
      },
      datatype: 'json',
      data: data
    })
    .then(res => {
      resolve(res.data)

    }).catch(err => {
      reject(err)
    })
  })
}
