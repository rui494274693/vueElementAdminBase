'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue后台模板' // 页面 title

//如果端口设置为80，
//使用管理员权限执行命令行。
//例如，Mac:sudo npm run
//您可以通过以下方法更改端口：
// port = 8099 npm run dev OR npm run dev --port = 8099
const port = process.env.port || process.env.npm_config_port || 8099 // dev port

// 所有配置项说明可在中找到 https://cli.vuejs.org/config/
module.exports = {
  /**
    *如果计划在子路径下部署站点，则需要设置publicPath，
    *例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/,
    *publicPath应该设置为“/bar/”。
    *在大多数情况下，请使用“/”！！！
    *详情: https://cli.vuejs.org/config/#publicpath
  */
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './', //公共路径
  outputDir: 'dist', //输出目录
  assetsDir: 'static', //资源目录
  lintOnSave: false, //关闭每次保存都进行检测
  productionSourceMap: true, //生产环境是否生成 sourceMap 文件 作用是定位。source map定位的时浏览器控制台输出语句在项目文件的位置
  devServer: {
    port: port,
    open: false,  //在DevServer第一次构建完成时，自动用浏览器打开网页，默认是true
    overlay: {  //出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。
      warnings: false,
      errors: true
    },
    proxy: {
      //测试时前端模拟的mock数据接口
      '/test': {
        target: `http://127.0.0.1:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          '^/test': '/'
        }
      },
      //线上测试接口
      '/onlineTest': {
        ws: false,
        target: `http://127.0.0.1:3000`,
        changeOrigin: true,
        pathRewrite: {
          '^/onlineTest': '/'
        },

      },
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    //在webpack的name字段中提供应用程序的标题，以便
    //可以在中访问index.html插入正确的标题。
    /*
      *webpack在启动后会从配置的入口模块触发找出所有依赖的模块，
      *Resolve配置webpack如何寻找模块对应的文件。
      *webpack内置JavaScript模块化语法解析功能，
      *默认会采用模块化标准里约定好的规则去寻找，
      * @=src目录
    */
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        // '@api': resolve('src/api'),
        // '@components': resolve('src/components'),
        // '@pages': resolve('src/pages'),
        // '@router': resolve('src/router'),
        // '@store': resolve('src/store'),
        // '@utils': resolve('src/utils'),
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    //它可以提高第一屏的速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 运行时忽略 runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当页面太多时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只有最初的第三方依赖包
                  
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为单个包
                  priority: 20, //  重量需要大于libs和app，否则将打包为libs或app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  最小公共数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
