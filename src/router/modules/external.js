/** 对外开放的路由，不会被路由守卫拦截**/

const external = [
  {
    name:'externalIndex',
    path: '/external/index',
    component: () => import('@/external/index'),
	 hidden: true,
    meta: {
      title: '外部页面'
    }
  },
]

export default external
