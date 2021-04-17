/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import Three from '@/layout/components/three.vue'
const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: '路由嵌套',
    icon: 'nested'
  },
  children: [
    {
      path: 'Menu1',
      component: Three, // Parent router-view
      // component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Three',
      meta: { title: 'menu1' },
      redirect: '/nested/menu1/menu1-1',
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: 'menu1-1',}
        },
        // {
        //   path: 'menu1-2',
        //   component: Empty2, // Parent router-view
        //   // component: () => import('@/views/nested/menu1/menu1-2'),
        //   name: 'Empty2',
        //   redirect: '/nested/menu1/menu1-2/menu1-2-1',
        //   meta: { title: 'menu1-2'},
        //   children: [
        //     {
        //       path: 'menu1-2-1',
        //       component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
        //       name: 'Menu1-2-1',
        //       meta: { title: 'menu1-2-1' }
        //     },
        //     {
        //       path: 'menu1-2-2',
        //       component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
        //       name: 'Menu1-2-2',
        //       meta: { title: 'menu1-2-2' }
        //     }
        //   ]
        // },
        {
          path: 'menu1-3',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'menu1-3' }
        }
      ]
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: 'menu2' }
    }
  ]
}

export default nestedRouter
