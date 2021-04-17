import {
  newRouters
} from '@/api/system/addRoutes'
import Layout from '@/layout' //是架构组件，不在后台返回，在文件里单独引入
import {
  constantRoutes, //公共路由
  demoRoutes

} from '@/router'

//路由提级
function allChildren(list, arr) {
  list.forEach(li => {
    var add = JSON.parse(JSON.stringify(li))
    var ad = {
      id: add.id,
      pid:add.pid,
      component: add.component,
      name: add.name,
      title: add.title,
      path: add.path,
      icon:add.icon,
      hidden:add.hidden
    }

    // if (add.component != 'none') {

      arr.push(ad)
    // }
    if (add.children && add.children.length) {
      allChildren(add.children, arr)
    }
  })
  return arr
}
//格式化路由组件
function filterRoutes(routeData) {
  const newRouters = routeData.filter(data => {
	  data.hidden = data.hidden
    if (data.component) {
      if (data.component === 'Layout') { //Layout组件特殊处理
        data.component = Layout
      }else{
        data.component = getViews(data.component)
        data.noCache = false
      }
      data.name = data.name

      data.meta = {
        title: data.title,
        icon: data.icon,
      }
    }
    if (data.children && data.children.length) {
      data.redirect = 'noRedirect' //点击面包屑导航的时候 默认跳转到第一个子路由
      data.children = filterRoutes(data.children)
    }
    return true
  })
  return newRouters
}
//讲后台路由字符串转化为组件
function getViews(path) {
  return resolve => {
    require.ensure([], (require) => {
      // resolve(require('@/pages' + path))
      resolve(require('@/pages' + path + '.vue'))
    })
  }
}


const state = {
  routes: [],
  addRoutes: [],
  demoRoutes: [],
  activeTopMenuId: ''
}

const mutations = {
  SET_ROUTES: (state, data) => {
    const {
      allRoute,
      newRoute,
      dmRoute
    } = data
    state.addRoutes = newRoute
    state.demoRoutes = dmRoute
    state.routes = allRoute
  },
  CLEAR_ROUTES: (state) => {

    state.addRoutes = []
    state.demoRoutes = []
    state.routes = []
  },
  SET_ACTIVETOPMENUID: (state, data) => {

    state.activeTopMenuId = data
  },
}

const actions = {
  generateRoutes({
    commit
  }, res) {
    return new Promise(resolve => {

      newRouters().then(response => {//请求权限菜单的数据
        var data = response.data; //后台返回的菜单
        var deepCopy = JSON.parse(JSON.stringify(data)) //深拷贝数据
        var newRoute = filterRoutes(deepCopy) //组件化 后台返回的菜单
        var dmRoute = [] //demo菜单 只在admin里显示
        var allRoute = [] //全部的路由

        var all = []
        var al = JSON.parse(JSON.stringify(data))
        al.forEach(da => {
          if (da.component == "Layout" && da.children && da.children.length) {
            var allChildrenData = allChildren(da.children, []);
            da.children = allChildrenData
          }
        })
        var nRoute = filterRoutes(al)

        newRoute = constantRoutes.concat(newRoute)
        if (res.role.includes('admin')) {
          dmRoute = demoRoutes; //admin时 有demo路由

          allRoute = newRoute.concat(demoRoutes)
          all = nRoute.concat(demoRoutes)
        } else {
          dmRoute = [];

          allRoute = newRoute
           all = nRoute
        }

        allRoute.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        all.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        commit('SET_ROUTES', {
          allRoute,
          newRoute,
          dmRoute
        })

        resolve(all)
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },
  clearRoute({
    commit
  }) {
    return new Promise(resolve => {
      commit('CLEAR_ROUTES')
      resolve([])
    })
  },
  //设置顶部菜单的ID
  setTopMenuId({
    commit
  },data) {
    return new Promise(resolve => {
      
      commit('SET_ACTIVETOPMENUID',data.id)
      resolve(data.id)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
