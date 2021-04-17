import request from '@/utils/request'

export function newRouters() {
  return request({
    url: '/functionController/getFunctionList',
   // url: '/api/function/findFunctionList',
    method: 'get',
    // params: { token }
  })
}

export function allRouters() {
  return request({
    url: '/functionController/getAllFunctionList',
    method: 'get',
    // params: { token }
  })
}
