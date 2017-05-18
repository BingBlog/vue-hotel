import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
// import actions from './actions'
// import getters from './getters'

Vue.use(Vuex)

const state = {
  location: {}, // 当前定位信息
  city: {
    cityName: '', // 所选城市名称
    cityId: '' // 所选城市ID
  },
  isShowCityBox: false,
  isShowDatePicker: false,
  isShowQuerySelector: false,
  roomType: 1, // 1: fullTimeRoom 2: hoursRoom
  checkinDate: '2017-05-05',
  checkoutDate: '2017-05-06',
  keyword: '',
  lettersConfig: []
}

export default new Vuex.Store({
  state,
  // getters,
  // actions,
  mutations
})
