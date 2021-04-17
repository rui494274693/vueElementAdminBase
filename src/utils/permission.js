import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
//格式化路由组件
export function filterRoutes(routeData){
	const newRouters = routeData.filter(data => {
	  if (data.component) {
	    if (data.component === 'layout') { //Layout组件特殊处理
	      data.component = Layout
	    } else {
	      data.component = getViews(data.component)
	    }
	    data.name = data.id

	    data.meta = {
	      title: data.title,
	      icon: data.ico
	    }
	  }
	  if (data.children && data.children.length) {
	     data.redirect = data.children[0].component //点击面包屑导航的时候 默认跳转到第一个子路由
	    data.children = filterRoutes(data.children)
	  }
	  return true
	})
	return newRouters
}
//讲后台路由字符串转化为逐渐
export function getViews(path) {
  return resolve => {
    require.ensure([], (require) => {
      resolve(require('@/pages' + path + '.vue'))
    })
  }
}
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
