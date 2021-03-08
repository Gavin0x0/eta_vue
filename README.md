# ETA_Vue
## 项目说明
 - 此项目为基于 Vue + Jfinal 的前后端分离项目的前端部分
 - 采用element-ui作为UI库，详情请见 [官方文档](https://element.eleme.cn/#/zh-CN/component/quickstart)
 - 采用vuex存储全局变量，全局变量配置在「store」文件夹中
 - 采用vue-router作导航管理，导航管理在「router」文件夹中
 - 采用axios来对后端接口进行调用，接口的说明及配置在「api」文件夹中
 - 作为单页面应用，程序的主入口为App.js，顶层路由分为「登陆页面」及「主页面」两块，其中主页面中各个功能页面的切换以视图形式展现，通过二级路由切换，视图存放在「views」文件夹中
## 首次启动前安装依赖
```
yarn install
```

### 启动项目
```
yarn serve
```

### 打包
```
yarn build
```

### 项目特点
 - 用渐进式框架Vue将前端页面全部重构
 - 在不改动原有数据库结构的基础上，将原项目重构为前后端分离项目
#### 优点  
 - 可以在不停止后端服务的情况下，快速对前端页面进行迭代，从打包到上线最快仅需1分钟


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
