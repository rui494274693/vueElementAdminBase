import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {
  getToken
} from '@/utils/auth'
var baseURL = '/onlineTest' //测试环境

process.env.NODE_ENV === 'development' ? baseURL = '/onlineTest' : baseURL = '/'
// create an axios instance
const service = axios.create({
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  // },
  baseURL: baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
      config.headers['x-requested-with'] = 'XMLHttpRequest'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    /*
    返回状态码code判断
      1000	返回成功
      1001	没有登录
      1002	登录过期
      1004	没有权限访问
      2000	业务处理错误，详细在msg里有详细
      2100	社交没有绑定系统用户错误
    */

    if (res.code == '1000') { //成功

      return res
    } else if (res.code == '1001' || res.code == '1002') { //1001 没有登录 , 1002 登录过期
      store.dispatch('user/logout')
      store.dispatch('permission/clearRoute')
      store.dispatch('tagsView/delAllViews')
      router.push(`/login`)
    } else if (res.code == '1004') { //没有权限访问
      Message({
        message: '没有权限访问!',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (res.code == '2000') { //业务处理错误，详细在msg里有详细
      Message({
        message: res.msg || '业务处理错误，详细在msg里有详细',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (res.code == '2100') { //社交没有绑定系统用户错误
      Message({
        message: res.msg || '社交没有绑定系统用户错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
    // store.dispatch('user/resetToken').then(() => {
    //   location.reload()
    // })


  },
  error => {
    console.log(error);
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
