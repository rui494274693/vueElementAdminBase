import request from '@/utils/request'
import request2 from '@/utils/request2'

export function adddMenu(data) {
  return request({
    url: '/functionController/addFunction',
    method: 'post',
    params: data
  })
}

export function uploadMenu(data) {
  return request({
    url: '/functionController/updateFunction',
    method: 'post',
    params: data
  })
}

export function deleteMenu(data) {
  return request({
    url: 'functionController/deleteFunction',
    method: 'post',
    params: data
  })
}