import request2 from '@/utils/request2'

export function login(data) {
  return request2({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request2({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request2({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
