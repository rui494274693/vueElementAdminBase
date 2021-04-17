import request from '@/utils/request'
import request2 from '@/utils/request2'
//用户列表数据
export function userList(data) {
  return request({
    url: '/qnUserController/findUserList',
    method: 'get',
    params: data
  })
}

//添加
export function addUser(data) {
  return request({
    url: '/qnUserController/addUser',
    method: 'post',
    params: data
  })
}
//修改
export function updateUser(data) {
  return request({
    url: '/qnUserController/updateUser',
    method: 'post',
    params: data
  })
}

//删除
export function deleteUser(data) {
  return request({
    url: '/qnUserController/deleteUser',
    method: 'post',
    params: data
  })
}
