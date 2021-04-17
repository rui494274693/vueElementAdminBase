import request from '@/utils/request'
import request2 from '@/utils/request2'
//列表数据
export function orgList() {
  return request({
    url: '/qnOrgController/getList',
    method: 'post'
  })
}

//获取类型
export function codeGetTypes(data) {
  return request({
    url: '/qnTypeController/codeGetTypes',
    method: 'get',
    params: data
  })
}
//添加组织机构
export function addOrg(data) {
  return request({
    url: '/qnOrgController/addOrg',
    method: 'post',
    params: data
  })
}
//修改组织机构
export function updateOrg(data) {
  return request({
    url: '/qnOrgController/updateOrg',
    method: 'post',
    params: data
  })
}

//所有用户
export function getAllUser(data) {
  return request({
    url: '/qnUserController/getAllUser',
    method: 'get',
    params: data
  })
}



//组织机构 添加用户
export function orgOfUser(data) {
  return request({
    url: '/qnOrgController/orgOfUser',
    method: 'post',
    params: data
  })
}
//当前组织机构 的用户
export function orgIdGetList(data) {
  return request({
    url: '/qnUserController/orgIdGetList',
    method: 'post',
    params: data
  })
}


//删除
export function deleteOrg(data) {
  return request({
    url: '/qnOrgController/deleteOrg',
    method: 'post',
    params: data
  })
}
