import request2 from '@/utils/request2'

export function getToken() {
  return request2({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
