import {
  CITY,
  ROOM_TYPE,
  LOCATION,
  IS_SHOW_CITY_BOX,
  KEYWORD,
  IS_SHOW_DATE_PICKER,
  CHECK_IN_OUT_INFO
} from './mutation-types.js'

export default {
  // 当前选择的城市
  [CITY] (state, city) {
    state.city.cityName = city.cityName
    state.city.cityId = city.cityId
  },
  // 钟点房还是全日房
  [ROOM_TYPE] (state, roomType) {
    state.roomType = roomType
  },
  [LOCATION] (state, location) {
    state.location = location
  },
  [IS_SHOW_CITY_BOX] (state, isShowCityBox) {
    state.isShowCityBox = isShowCityBox
  },
  [KEYWORD] (state, keyword) {
    state.keyword = keyword
  },
  [IS_SHOW_DATE_PICKER] (state, isShowDatePicker) {
    state.isShowDatePicker = isShowDatePicker
  },
  [CHECK_IN_OUT_INFO] (state, checkInOutInfo) {
    state.checkinDate = checkInOutInfo.checkinDate
    state.checkoutDate = checkInOutInfo.checkoutDate
  }
}
