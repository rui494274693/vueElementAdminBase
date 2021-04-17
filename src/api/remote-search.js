import request2 from '@/utils/request2'

export function searchUser(name) {
  return request2({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request2({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
