import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS重置的替代方案

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import './utils/icon/icon.js'
import './utils/icon/icon.css'

/**
  *如果你不想使用mock-server
  *您想将MockJs用于mock api
  *可以执行：mockXHR（）
  *
  *目前MockJs将用于开发环境，
  *
*/

import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'development') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // 设置 element-ui 默认 size
  locale: enLang, // 如果使用中文，无需设置，请删除
  i18n: (key, value) => i18n.t(key, value),

})

// 全局注册 筛选器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

Vue.prototype.getName = function (){
  return router.currentRoute.name

}
