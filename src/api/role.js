import request2 from '@/utils/request2'

export function getRoutes() {
  return request2({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request2({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request2({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request2({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request2({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
