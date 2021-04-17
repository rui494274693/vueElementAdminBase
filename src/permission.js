import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 页面加载进度条
import 'nprogress/nprogress.css' // 页面加载进度条 style
import { getToken } from '@/utils/auth' // 从 cookie 里获取token
const defaultSettings = require('./settings.js')

NProgress.configure({ showSpinner: false }) // 页面加载进度条 配置

import external from '@/router/modules/external' //对外开放的页面 不登录可看

function checkWhite(whiteList,to){
  var rs = -1
  if(to.path.indexOf('/external/')>=0 ){
    rs = 0
  }else{
    rs=whiteList.indexOf(to.path)
  }
  return rs
}
function getChild(list,arr){
  list.forEach(li=>{
    if(li.path){
      arr.push(li.path)
    }
    if(li.children){
      getChild(li.children,arr)
    }
  })
  return arr
}
var adWhite = getChild(external,[])
external.forEach(ex => {
  if (ex.path) {
    adWhite.push(ex.path)
  }
})
const whiteList = ['/login', '/auth-redirect'].concat(adWhite) // 重定向白名单

/*
  路由守卫
  跳转前先判断是否有token
    有代表已登录 根据token向后台请求权限菜单
    没有未登录 跳转登录页面
*/
router.beforeEach(async (to, from, next) => {

  NProgress.start()   // 页面加载进度条 start

  // 设置页面title
  document.title = to.meta.title || defaultSettings.title


  // 根据token 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页

      next({
        path: '/'
      })
      NProgress.done() //页面加载进度条
    } else {
      //判断是否有菜单路由
      const hasRoutes = store.getters.add_routes && store.getters.add_routes.length > 0

      //有路由
      if (hasRoutes) {
        
        next()
      } else {
        //没有 向后台请求权限菜单数据
        try {

          //向后台请求权限菜单数据
          const accessRoutes = await store.dispatch('permission/generateRoutes', {
            role: store.getters.token
          })

          //添加路由
          router.addRoutes(accessRoutes)

          //刷新时 将刷新前选中的一级菜单回置
          const activeTopMenuId = localStorage.getItem("activeTopMenuId")
          store.dispatch('permission/setTopMenuId', {
            id: activeTopMenuId
          })
          next({ ...to,
            replace: true
          })

        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }

    }
  } else {
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {

      // 在免登录白名单中，直接进入
      next()
    } else {
      // 其他无权访问的页面将重定向到登录页面
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 页面进度条加载完成
  NProgress.done()

})
