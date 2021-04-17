
import request2 from '@/utils/request2'
//列表数据
export function list(data) {
  return request2({
    url: '/demo/list',
    method: 'get',
    params: data
  })
}

//添加
export function addDemo(data) {
  return request2({
    url: '/demo/add',
    method: 'post',
    params: data
  })
}
//修改
export function updateDemo(data) {
  return request2({
    url: '/demo/update',
    method: 'post',
    params: data
  })
}

//删除
export function deleteDemo(data) {
  return request2({
    url: '/demo/delete',
    method: 'post',
    params: data
  })
}
