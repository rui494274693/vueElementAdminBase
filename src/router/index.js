import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

import external from './modules/external' //外部可以访问的页面
/**
 * 注意：子菜单仅在路由children.length >= 1时出现
 *
 * hidden: true                   如果设置为true，则项目不会显示在边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项具有多个子路线时,
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用（必须设置！！！）
 * meta : {
    title: 'title'               名称显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'             菜单图标
    noCache: true                如果设置为true，将不缓存页面（默认为false）
    affix: true                  如果设置为true，则打开的二级菜单不可关闭
    breadcrumb: false            如果设置为false，则该项将隐藏在面包屑中（默认为true）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes 固定的路由 公共
 * 没有权限要求的基本页面
 * 所有角色可以访问
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/pages/public/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/pages/public/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/pages/public/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/pages/public/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/pages/public/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    hidden: true,
    meta: {
      title: '首页',
    },
    children: [{
      path: 'index',
      component: () => import('@/pages/index/index'),
      name: 'index',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }, {
      path: '/person/index',
      component: () => import('@/pages/person/index'),
      name: 'person',
      meta: {
        title: '个人资料',
        icon: 'dashboard',

      }
    }]
  },


].concat(external)


/**
 * demoRoutes
 * 示例 只有admin账号可以看
 */
export const demoRoutes = [

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/icons/index'),
      name: 'Icons',
      meta: {
        title: '图标',
        icon: 'icon'
      }
    }]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/documentation/index'),
      name: 'Documentation',
      meta: {
        title: '文档',
        icon: 'documentation'
      }
    }]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [{
      path: 'index',
      component: () => import('@/views/guide/index'),
      name: 'Guide',
      meta: {
        title: '引导页',
        icon: 'guide'
      }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/profile/index'),
      name: 'Profile',
      meta: {
        title: '权限测试页',
        icon: 'user'
      }
    }]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '角色权限',
      icon: 'lock'
    },
    children: [{
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '页面权限'
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '指令权限'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色权限'
        }
      }
    ]
  },



  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '综合实例',
      icon: 'example'
    },
    children: [{
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: {
          title: '创建文章',
          icon: 'edit'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: {
          title: '编辑文章',
          activeMenu: '/example/list'
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: {
          title: '文章列表',
          icon: 'list'
        }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/tab/index'),
      name: 'Tab',
      meta: {
        title: 'tab',
        icon: 'tab'
      }
    }]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [{
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: {
          title: 'page401'
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: {
          title: 'page404'
        }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [{
      path: 'log',
      component: () => import('@/views/error-log/index'),
      name: 'ErrorLog',
      meta: {
        title: '错误日志',
        icon: 'bug'
      }
    }]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [{
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: {
          title: '导出 Excel'
        }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: {
          title: '导出 已选择项'
        }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: {
          title: '导出 多级表头'
        }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: {
          title: '上传 Excel'
        }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: {
      title: 'zip',
      icon: 'zip'
    },
    children: [{
      path: 'download',
      component: () => import('@/views/zip/index'),
      name: 'ExportZip',
      meta: {
        title: '输出ZIP'
      }
    }]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [{
      path: 'index',
      component: () => import('@/views/pdf/index'),
      name: 'PDF',
      meta: {
        title: 'pdf',
        icon: 'pdf'
      }
    }]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/theme/index'),
      name: 'Theme',
      meta: {
        title: '换肤',
        icon: 'theme'
      }
    }]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/clipboard/index'),
      name: 'ClipboardDemo',
      meta: {
        title: '剪贴板Demo',
        icon: 'clipboard'
      }
    }]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/i18n-demo/index'),
      name: 'I18n',
      meta: {
        title: 'i18n',
        icon: 'international'
      }
    }]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://github.com/PanJiaChen/vue-element-admin',
      meta: {
        title: '外部链接',
        icon: 'link'
      }
    }]
  },

  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()
// console.log(Layout)
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {

  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
