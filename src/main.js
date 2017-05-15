// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import { sync } from 'vuex-router-sync'
import 'lib-flexible'
import moment from 'moment'
// 异步库
import Axios from 'axios'
Vue.prototype.$http = Axios
Vue.config.productionTip = false
sync(store, router)
/* eslint-disable no-new */
moment.locale('zh-cn', {
  relativeTime: {
    future: '%s',
    past: '%s前',
    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1',
    dd: '%d',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年'
  }
})
// 全局过滤器
Vue.filter('dateToMMDD', function (date) {
  return moment(date, 'YYYY-MM-DD').format('MM月DD日')
})
Vue.filter('dateToDay', function (date) {
  let dayToChinese = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
  }
  return dayToChinese[moment(date, 'YYYY-MM-DD').format('e')]
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
