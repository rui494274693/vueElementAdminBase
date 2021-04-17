import request from '@/utils/request'
import request2 from '@/utils/request2'
//登录
export function login(data) {
  return request({
    url: '/loginController/doLogin',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request2({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

//登出
export function logout() {
  return request({
    url: '/loginController/logout',
    method: 'post'
  })
}
