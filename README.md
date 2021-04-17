# 此框架基于PanJiaChen大佬的<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin">vue-element-admin</a>修改而成，在使用前建议先看看大佬的几篇文档<a target="_blank" href="https://juejin.cn/post/6844903476661583880">手摸手，带你用vue撸后台 系列一（基础篇）</a>,文档会帮助你避免掉很多问题！
<img  src="https://files.catbox.moe/yi2cgv.png">

## 菜单权限由后台控制

<p align="center">
  <img  src="https://files.catbox.moe/yc2phq.png">
  <img  src="https://files.catbox.moe/igydt5.png">
  <img  src="https://files.catbox.moe/5xyfsx.png">
  
</p>

### 在创建菜单时请注意，name字段对应的是页面里的name（红色的框），如果这两个地方不一致，keep-alive缓存会无效，（A页面输入内容，切换到B页面后，再切换回A页面，A页面输入的数据会丢失），而且每个菜单的name是唯一的，重复了keep-alive也会失效。
### 是否显示是指是否显示在菜单里，隐藏菜单仍可以通过路由访问
<p align="center">
  <img  src="https://files.catbox.moe/kpiloa.png">
</p>

### 文件路径要注意的是 一级菜单使用的是Layout这个字段，二级或多级目录使用的是none这个字段（因为目录没有指向具体的文件），子页面使用的才是具体指向的页面，如黄色箭头指向的，文件默认放置于src/pages文件夹下。

<p align="center">
  <img  src="https://files.catbox.moe/eqlhar.png">
</p>


## 后台接口的路径在项目根目录的vue.config.js里修改
<p align="center">
  <img  src="https://files.catbox.moe/mlv7n0.png">
</p>

## 后台接口返回的状态码在src/utils/request.js里修改

<p align="center">
  <img  src="https://files.catbox.moe/bgg1f8.png">
</p>

## src/permission.js是路由守卫

## src/external是放置外部页面的地方，在src/router/modules/external.js里可以配置对外开放的页面路由。
<p align="center">
  <img  src="https://files.catbox.moe/ruhl99.png">
</p>


## 命令

```bash
# clone the project
git clone https://github.com/rui494274693/vueElementAdminBase.git

# enter the project directory
cd vueElementAdminBase-master

# install dependency
npm install

# develop
npm run dev
```

浏览器打开 http://localhost:8099

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

这个只是前端的项目，还需要启动一个模拟后台接口的项目，地址是
<a target="_blank" href="https://github.com/rui494274693/vueElementAdminServer">vueElementAdminServer</a>




## 捐赠 

如果你觉得这个项目对您有帮助，你可以用以下行动支持一下作者:

![donate](https://files.catbox.moe/hz2wwk.png)






