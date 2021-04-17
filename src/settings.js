module.exports = {
  title: 'Vue基础后台模板',
  miniTitle: 'Vue',

  /**
   * @type {boolean} true | false
   * @description 是否显示设置右面板
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否需要tagsView 
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定 header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 需要显示错误日志组件
   * 默认值仅在生产环境中使用
   * 如果您还想在dev中使用它，可以传递['production'，'development'] 
   */
  errorLog: 'production'
}
