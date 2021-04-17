const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  demo_routes: state => state.permission.demoRoutes,
  add_routes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  demoMenu:state => state.app.demoMenu,
  activeTopMenuId:state => state.permission.activeTopMenuId, //顶部选中的一级菜单
}
export default getters
