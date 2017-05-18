# 关于这个项目
 1. 模仿美团M站的酒店项目，因为曾参与开发途牛国际酒店前端
 2. 项目使用vue + vue-router + vuex, 项目使用vue-cli生成
 3. 接口利用http-proxy-middleware代理美团M站线上接口， 部分无法代理接口根据线上数据存放到文件中
 4. 所有页面模板和样式部分全部借用美团酒店M站线上代码
 5. 采用了[better-scroll](https://github.com/ustbhuangyi/better-scroll)实现了本项目中的滚动效果
 6. 使用了moment来处理时间的格式转化
 7. 利用了vuex-router-sync在状态中存放路由的实例

# 已经完成的
  1. 首页轮播图
  2. 房型选择切换
  3. 首页目的地选择，城市选择列表和城市搜索
  4. 首页入住、离店时间选择，日期选择组件
  5. 首页的hotword选择，如此更多选项滚动列表，suggest搜索
  6. API统一管理

# 接下来要做的
  1. 搜索历史与本地缓存
  2. 首页搜索按钮点击更改路由至列表页
  3. 列表页

# 思考与总结

## 移动端长度单位的兼容性
利用淘宝推荐的[lib-flexible](https://github.com/amfe/lib-flexible)方案，具体可参见https://github.com/amfe/article/issues/17， 本项目中的字体并没有完全按照此方案

## 单页应用的中API管理

## 路由（URL）参数，应用的状态，组件的状态的同步与维护，利用vuex-router-sync，如何进行更好的管理

## 异步的组件来加快应用初始化展示速度

## 字母选择列表组件带来的思考
问题：字母列表组件在城市搜索和热词搜索组件中都有用到。为了实现组件复用中，何如选择？
答： 1、将字母列表组件放置到最高层级的dom结构中，此时在各个业务中都操作这一个实例。但是字母列表的点击事件如何触发对应业务的滚动事件就变得稍微复杂了。要么在点击事件中记录对应业务类型，仅触发对应类型的业务滚动事件，要么对所有业务分发事件，业务自己去判断当前自己是否是“对应”状态。
    2、将字母列表在各个业务中去引用，这样整个dom中会存在多个字母列表结构。但状态和时间处理起来更容易
如果能确保整个dom中不会出现多个列表，那么方案1是可行的。但协同起来其实并不好维护。

# 项目运行
  1. 由于接口限制，目前仅支持开发模式预览
  clone代码并安装依赖后执行 `npm start`，如果安装失败，请尝试cnpm

# 项目截图
 1. 首页整体效果
<img src="./exampleImg/index.png" width="380" alt="首页整体效果" text-align="left" />
 2. 城市选择列表
<img src="./exampleImg/city.png" width="380" alt="城市选择列表" text-align="left" />
 3. 城市搜索列表
<img src="./exampleImg/citySearch.png" width="380" alt="城市搜索列表" text-align="left" />
 4. 首页日期选择
<img src="./exampleImg/calendar.png" width="380" alt="首页日期选择" text-align="left" />
 5. 热词选择
<img src="./exampleImg/hotword.png" width="380" alt="热词选择" text-align="left" />
 6. 地铁选择
<img src="./exampleImg/subway.png" width="380" alt="地铁选择" text-align="left" />
