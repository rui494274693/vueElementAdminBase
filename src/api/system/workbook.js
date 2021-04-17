import request from '@/utils/request'

//获取字典列表
export function getAllType() {
  return request({
    url: '/qnTypeController/getAllType',
    method: 'get'
  })
}

//新增
export function addType(data) {
  return request({
    url: '/qnTypeController/addType',
    method: 'post',
    params: data
  })
}
//修改
export function updateType(data) {
  return request({
    url: '/qnTypeController/updateType',
    method: 'post',
    params: data
  })
}
//刷新字典缓存
export function refreshCache(data) {
  return request({
    url: '/qnTypeController/refreshCache',
    method: 'get'
  })
}
//删除字典
export function deleteType(data) {
  return request({
    url: '/qnTypeController/deleteType',
    method: 'post',
    params: data
  })
}
