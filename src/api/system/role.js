import request from '@/utils/request'
import request2 from '@/utils/request2'

export function getAllRole() {
  return request({
    url: '/qnRoleController/getAllRole',
    method: 'post'
  })
}
export function addRole(data) {
  return request({
    url: '/qnRoleController/addRole',
    method: 'post',
    params: data
  })
}

export function updateRole(data) {
  return request({
    url: 'qnRoleController/updateRole',
    method: 'post',
    params: data
  })
}

export function getRoutesMenu(data) {
  return request({
    url: '/functionController/roleIdGetFunctionList',
    method: 'get',
    params: data
  })
}
export function uploadRoutesMenu(data) {
  return request({
    url: '/functionController/roleOfSaveFunction',
    method: 'post',
    params: data
  })
}



export function deleteRole(data) {
  return request({
    url: '/qnRoleController/deleteRole',
    method: 'post',
    params: data
  })
}

export function getAllUser() {
  return request({
    url: '/qnUserController/getAllUser',
    method: 'get'
  })
}
export function roleIdGetUsers(data) {
  return request({
    url: '/qnRoleController/roleIdGetUsers',
    method: 'get',
    params: data
  })
}

export function roleOfUsers(data) {
  return request({
    url: '/qnRoleController/roleOfUsers',
    method: 'post',
    params: data
  })
}
