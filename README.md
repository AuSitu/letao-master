### 总结

1. 了解git的克隆和获取代码
2. 了解项目的架构和目录结构
3. 搭建项目的环境
4. 启动项目
5. 理解项目依赖包和引包顺序
6. less的基本使用和与sass的区别
7. 主页的搭建和轮播图组件的使用

## 使用github搭建一个博客  还可以托管你之前所做的很多静态页面项目

1. 把代码上传到github上
2. 创建一个gh-pages分支  打开github在 branch： master 点击 输入gh-pages回车
3. 通过https://zwxs.github.io/handplan 打开这个项目  如果没有index.html http://zwxs.github.io/handplan/文件名.html

使用命令的方式创建一个分支并且往这个分支提交代码

git branch gh-pages  创建一个分支 分支名gh-pages
git checkout gh-pages
git branch 查看当前所在的分支
git push -u origin gh-pages 把本地仓库的代码提交到远程的gh-pages分支


## 静态页面的访问原理

1. 是github官网提供的一个功能 你只需要把代码提交到gh-pages分支里面 就可以通过github给你免费域名来访问
2. 你的github仓库名是什么 访问域名就是 https://用户名.github.io/仓库名
3. 去github创建一个仓库
4. 往仓库里面提交代码即可
    1. git init 初始化
    2. git add . 添加到暂存区
    3. git commit -m '提交日志'  提交到本地仓库
    4. git remote add origin 远程仓库的地址  指定远程仓库地址
    5. git push -u origin master 把本地的仓库的代码提交到远程仓库的master主分支
    6. git branch gh-pages 创建一个gh-pages的分支 
    7. git checkout gh-pages 切换到gh-pages分支
    8. git push origin gh-pages 把本地仓库的代码提交到远程的gh-pages  如果不是第一次提交到远程 就不需要-u

## git的一些参数

  1. git commit -m '提交日志'  -m  把暂存区的代码提交到本地仓库
  2. git commit -am '提交日志' -am 把跟踪过的代码提交到本地仓库  
     git add . git commit -m '提交'
  3. git push -u origin master -u指的当前远程仓库和本地仓库相绑定
  4. ssh-keygen -t rsa -C  -C表示注释

## git查看版本和版本回退

  1. git log 查看历史版本
  2. git reset 进行版本的回退 
     1. 回到上一个版本 git reset  --hard HEAD^
     2. 回到指定版本 git reset  --hard 版本号(4b80b68)
     

## 电商全端项目 http://m.letao.com/
  1. 卖鞋和包的一个综合电商平台
  2. H5+C3+移动web+ajax   一起运用到项目


## 电商全端项目架构

  1. 后台采用nodejs+mysql 搭建后台服务器  后台就是为了给前端提供接口
      1. letao-master文件夹 除了public docs文件夹以外的都是后台的node的代码
      2. 这些代码的作用就是给前端提供API接口 接口的文档 docs文件夹
      3. 类似于 http://localhost:3000/category/queryTopCategory 的接口
  2. 前端是采用移动端+PC后台管理系统 前端负责界面显示 
      1. 前端移动端类似jd一样 负责页面的展示 多了数据交互
      2. 前端后台管理系统 阿里百秀管理前端的数据
      3. 前端 PC和移动端 都是负责页面展示 调用接口显示数据
  3.  后端 nodejs是前端和数据库之间的桥梁  数据库 存储数据库
      1. 后台 nodejs 操作数据 获取数据 制作API接口
  4. 我们目前的任务就是负责前端界面展示以及获取nodejsAPI接口实现前后的交互
      1. 目前我们只需要关系后台接口的文档 怎么调用即可 以及如何把数据渲染到页面


## 回顾项目环境搭建

  1. 安装node  打开node js安装包 一路下一步安装 保证每个人都要装好
  2. 导入数据库  打开phpstudy 启动  》 mysql管理器  》 选择导入 选择letao初始化.sql文件 选择编码为UTF-8 点击导入
  3. 启动项目 打开项目文件夹3-源代码里面 letao-master 建议你都把letao-master放在一个很好找的目录比如桌面
  4. 进入letao-master文件夹的根目录 输入npm start 回车 出现 node ./bin/www表示成功
     如果出现 Port 3000 is already in use 表示开启了多个黑窗 只留一个就可以
  5. 导入一个书签 点击书签导入 选择导入以前的html文件 选择书签.html书签文件 导入  点击已导入书签栏里的乐淘 打开完整和自写版能够打开就表示启动成功
  6. 后面访问页面的时候 使用书签里面的页面


## 乐淘项目使用框架介绍

  1. 移动端 UI使用的MUI框架 http://dev.dcloud.net.cn/mui/ui/
  2. 字体图标使用 fontawesome专门的字体图标库 http://www.fontawesome.com.cn/faicons/
  3. zeptoJS库 方便操作DOM元素 已经发送ajax请求 http://www.css88.com/doc/zeptojs_api/
  4. 模板引擎 artTemplate  方便渲染数据到页面 https://aui.github.io/art-template/zh-cn/docs/index.html
  5. PC端的 UI使用bootstrap  http://v3.bootcss.com/
  6. less.js编译less文件 http://lesscss.cn/

## letao-master整个项目的目录结构

  1. .git 本地仓库文件夹
  2. bin 项目启动的文件夹 》 www就是项目的启动文件(用来开启nodejs服务器)  www代码是node代码  开启了 nodejs的服务器 
  3. docs 项目的文档文件夹 接口文档 书签 数据库sql文档
  4. models node.js的数据模型文件 跟数据库的数据表对应的文件 用来增删改查当前的数据表
  5. node_modules nodejs的项目依赖包文件夹 如果没有无法启动npm start   执行npm install下载依赖包
  6. public 公开的公共的 前端公开的文件夹 分别是完整移动端 完整PC端 自写移动端 自写PC端
  7. routes node.js的路由文件夹 路由就是匹配你的的url  返回前端需要的内容 可能是静态页面 也可能是数据
  8. .gitignore git的忽略清单文件 把一些不需要被git管理的文件 忽略
  9. app.js 项目的主入口文件 项目主页一样 app.js node.js里面的主页 
      (概念和前端的index.html类似)
  10. package.json npm 的包管理配置文件 当前项目依赖包
  11. README.md 项目说明文档 写项目笔记
  12. 电商项目.md 我写的项目笔记 


## 前端的目录 public里面的目录

  1. mobile 完整版的移动端文件夹
  2. manage 完整版 PC端文件夹
  3. m 自写版移动端文件夹
  4. admin 自写版的PC端文件夹
  
## 前端去那里写代码 怎么写代码 
  1. 进入m里面去写代码  写移动端页面  
      1. 保留 images 和 lib 图片和依赖包文件夹其余删掉
      2. 新建一个 index.html
  2. 进入admin里面去写代码 写PC端页面  
      2. 保留images 和 lib 其他的删掉
      3. 新建一个login.html

## 项目如何访问( 强调一下只能使用这个网址访问项目)
  1. 使用书签的方式
  2. 或者直接访问地址
     1. 乐淘完整版移动端 http://localhost:3000/mobile/index.html
     2. 乐淘完整版PC端 http://localhost:3000/manage/login.html
     3. 乐淘自写版移动端 http://localhost:3000/m/index.html
     4. 乐淘自写版PC端  http://localhost:3000/admin/login.html


## nodejs黑窗 和前端页面的关系

     1. 乐淘完整版移动端 http://localhost:3000/mobile/index.html
     2. 乐淘完整版PC端 http://localhost:3000/manage/login.html
     3. 乐淘自写版移动端 http://localhost:3000/m/index.html
     4. 乐淘自写版PC端  http://localhost:3000/admin/login.html
    以上4个地址都是nodejs服务器提供的网址node.js在后台开启了一个网页服务器 服务器的网址localhost端口是3000 localhost:3000 (服务器网址)  
    对于前端来说localhost:3000把public作为网站根目录  public里面的文件夹需要访问
    http://localhost:3000/m/  === public里面的m


## 搭建乐淘移动端的首页

  1. 创建首页index.html
  2. 添加视口
  3. 引包
      <!-- 1. 引入mui的CSS文件 -->
      <link rel="stylesheet" href="lib/mui/css/mui.css">
      <!-- 2. 引入字体图标的CSS文件 -->
      <link rel="stylesheet" href="lib/fontAwesome/css/font-awesome.css">
      <!-- 3. 引入主页的less文件 注意 rel="stylesheet/less"-->
      <link rel="stylesheet/less" href="less/index.less">
      <!-- 4. 引入less的编译器文件 -->
      <script src="lib/less/less.js"></script>
      <!-- 5. 引入mui的js文件 -->
      <script src="lib/mui/js/mui.js"></script>
      <!-- 6. 引入zepto的js文件 操作元素发送请求 -->
      <script src="lib/zepto/zepto.min.js"></script>
      <!-- 7. 引入模板引擎的js文件 -->
      <script src="lib/artTemplate/template.js"></script>
      <!-- 8. 引入主页的js文件 -->
      <script src="js/index.js"></script>

## 乐淘的标签容器结构

      <!-- 头部区域 -->
      <header id="header">
      </header>
      <!-- 中间主体区域 -->
      <main id="main">
        <!-- 轮播图区域 -->
        <section id="slide"></section>
        <!-- 导航区域 -->
        <nav id="nav"></nav>
        <!-- 广告区域 -->
        <section id="banner"></section>
        <!-- 品牌专区 -->
        <section id="brand"></section>
        <!-- 运动专区 -->
        <section id="sport"></section>
        <!-- 女士专区 -->
        <section id="women"></section>
        <!-- 男士专区 -->
        <section id="man"></section>
      </main>
      <!-- 底部区域 -->
      <footer id="footer"></footer>


## 区域滚动插件的使用

1. 给页面添加一个区域滚动的父容器
     <!-- 区域滚动的父容器 -->
        <div class="mui-scroll-wrapper">
        </div>
2. 添加一个区域滚动的子容器
        <!-- 区域滚动的父容器 -->
        <div class="mui-scroll-wrapper">
            <!-- 区域滚动的子容器 -->
            <div class="mui-scroll">
            </div>
        </div>
3. 把要做区域滚动的内容 轮播图 导航等放到区域滚动的子容器里面

      <!-- 区域滚动的父容器 -->
        <div class="mui-scroll-wrapper">
            <!-- 区域滚动的子容器 -->
            <div class="mui-scroll">
               <!-- 真实的内容放到区域滚动的子容器里面 -->
               <section id="slide">
               </section>
               <nav id="nav">
               </nav>
            </div>
        </div>
4. 初始化区域滚动的插件 

      //获取区域滚动的父容器调用初始化方法  里面可以传一些配置参数
      mui('.mui-scroll-wrapper').scroll({
          scrollY: true, //是否竖向滚动
          scrollX: false, //是否横向滚动
          startX: 0, //初始化时滚动至x
          startY: 0, //初始化时滚动至y
          indicators: true, //是否显示滚动条
          deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
          bounce: true //是否启用回弹
      });
    以上都是默认值如果都一样可以不传这些配置参数

5. 由于之前给main添加padding 里面的区域滚动是使用了绝对定位的 不会受到父元素padding的影响
    1. 需要给.mui-scroll-wrapper放一个相对定位的父元素 而且这个父元素还必须有高度
          html,
          body {
              height: 100%;
          }
          body {
              /* 给body去添加padding 让相对定位的main到中间 */
              padding: 45px 0;
          }
          /* 中间主体区域公共样式 */
          #main {
              /* 给main添加相对定位 */
              position: relative;
              height: 100%;
          }
        要给main添加高度100%  body 和 html都要高度100%
    2. 而且.mui-scroll-wrapper的父容器不能有padding 不会受到父元素padding的影响
        给body添加padding 让main只有中间部分的高度减掉了头和尾
        body {
              /* 给body去添加padding 让相对定位的main到中间 */
              padding: 45px 0;
          }


6. 定位总结
  1. 相对定位 特征是会受到标准流的影响  是会受到父元素的padding的影响的
  2. 绝对定位 是脱标 不会受到标准的一些影响 只会参照相对定位的父元素的位置  不会受到元素的padding 的影响  位置只受left top值的影响 margin 
  3. 不要给绝对定位的父元素添加padding

## 总结

1. 项目架构 前端(移动端PC端) 后端 (nodejs) 数据库 (mysql)
2. 项目的环境搭建
   1. 安装nodejs
   2. 导入数据库
   3. 进入letao-master
   4. 打开黑窗执行npm start
   5. 访问乐淘移动端(或者书签)  （千万注意不要使用右键编辑器打开页面要使用对应服务器）
       1. 乐淘完整版移动端 http://localhost:3000/mobile/index.html
       2. 乐淘完整版PC端 http://localhost:3000/manage/login.html
       3. 乐淘自写版移动端 http://localhost:3000/m/index.html
       4. 乐淘自写版PC端  http://localhost:3000/admin/login.html
3. 项目目录结构
  前端目录结构public里面
  其余都是属于后端的目录结构

4. 写前端代码
   1. 进入public文件夹
     mobile 完整移动端
     manage 完整PC端
     m      自写移动端
     admin  自写PC端

5. 进m文件夹 删除除了images 和 lib 其余文件
6. 创建index.html 通过http://localhost:3000/m/index.html 表示可以写代码了
7. 项目的依赖包
   1. MUI 移动端的UI框架
   2. fontawesome 字体图标库
   3. zepto 操作DOM和 发送ajax
   4. arttemplate 模板引擎
   5. less.js 编译less
   6. bootstrap PC端UI框架

8. 项目的引包
   1. 先引入第三方的包  
   2. 再引入自己的包
      <!-- 1. 引入MUI的CSS文件 提供组件样式MUI布局-->
      <link rel="stylesheet" href="lib/mui/css/mui.css">
      <!-- 2. 引入字体图标的CSS文件 提供一些字体图标-->
      <link rel="stylesheet" href="lib/fontAwesome/css/font-awesome.css">
      <!-- 3. 引入首页的less文件  一定要注意把 rel="stylesheet/less" 自写的样式-->
      <link rel="stylesheet/less" href="less/index.less">
      <!-- 4. 引入less.js的编译器文件 编译less文件-->
      <script src="lib/less/less.js"></script>
      <!-- 5. 引入MUI的JS包 实现MUIJS效果-->
      <script src="lib/mui/js/mui.js"></script>
      <!-- 6. 引入模板引擎 渲染模板 -->
      <script src="lib/artTemplate/template.js"></script>
      <!-- 7. 引入zepto 帮我们去操作DOM发送ajax -->
      <script src="lib/zepto/zepto.min.js"></script>
      <!-- 8. 引入主页的JS文件  自己写JS逻辑代码-->
      <script src="js/index.js"></script>

  3. CSS在head中引入
  4. JS在body结束标签上引入 (除了对页面加载有帮助的CSS)


9. 搭建乐淘首页

  1. 头部区域
  2. 轮播图
  3. 导航
  4. 广告
  5. 品牌专区
  6. 运动专区
  7. 男士专区
  8. 女士专区
  布局主要使用MUI的栅格系统

10. 轮播图插件 http://dev.dcloud.net.cn/mui/ui/#gallery
    1. 写轮播图插件的结构
      <div class="mui-slider">
        <!-- 轮播图的图片容器 -->
        <!-- 如果要添加无缝轮播图 轮播图图片容器要添加一个mui-slider-loop 类名 -->
        <div class="mui-slider-group mui-slider-loop">
            <!-- 图片要多放2个图片 第一张是最后一张 最后一张是第一张 第一张和最后一张要添加mui-slider-item-duplicate 类名 -->
            <!--支持循环，需要重复图片节点-->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a href="#">
                    <img src="images/banner6.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner1.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner2.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner3.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner4.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner5.png" alt="">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="#">
                    <img src="images/banner6.png" alt="">
                </a>
            </div>
            <!--支持循环，需要重复图片节点-->
            <div class="mui-slider-item mui-slider-item-duplicate">
                <a href="#">
                    <img src="images/banner1.png" alt="">
                </a>
            </div>
        </div>
        <!-- 轮播图的小圆点容器 -->
        <div class="mui-slider-indicator">
            <div class="mui-indicator mui-active"></div>
            <div class="mui-indicator"></div>
            <div class="mui-indicator"></div>
            <div class="mui-indicator"></div>
            <div class="mui-indicator"></div>
            <div class="mui-indicator"></div>
        </div>
      </div>
    2. 一个大容器  里面一个图片容器 旁边小圆点容器
    3. 如果需要无法轮播图 要给图片容器添加mui-slider-loop类名
    4. 多放2张图 第一张是最后一张图标 最后一张是第一张图标 并且添加 mui-slider-item-duplicate
    5. 轮播图默认无法自动轮播图 要调用JS初始化轮播图
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        //调用slider初始化轮播图
        gallery.slider({
            //自动轮播图的间隔时间
            interval: 1000 
        });
  
11. 区域滚动插件的使用 http://dev.dcloud.net.cn/mui/ui/#scroll
  
    1. 写区域滚动的结构 
          1 个父容器 <div class="mui-scroll-wrapper"></div>
          1 个子容器 <div class="mui-scroll"></div>
          内容放到子容器里面  ul 等内容
          <div class="mui-scroll-wrapper">
            <div class="mui-scroll">
              <!--这里放置真实显示的DOM内容-->
            </div>
          </div>
    2. 初始化区域滚动
       // 初始化区域滚动插件
        mui('.mui-scroll-wrapper').scroll({
           scrollY: true, //是否竖向滚动
           scrollX: false, //是否横向滚动
           startX: 0, //初始化时滚动至x
           startY: 0, //初始化时滚动至y
           indicators: false, //是否显示滚动条
           deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
           bounce: true //是否启用回弹
        });
    3. 注意区域滚动的父容器和子容器都是绝对定位所以要确保他们的父元素没有padding 如果有padding就会参照盒模型不会参照内容
      <main id="main">
         <div class="mui-scroll-wrapper">
            <div class="mui-scroll">
              <!--这里放置真实显示的DOM内容-->
            </div>
          </div>
      </main>
