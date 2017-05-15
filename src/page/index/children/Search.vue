<template>
  <div class="search-box">
    <div class="search-header">
      <div class="header-left" @click="changeRoomType(1)">
        <div class="content">全日房</div>
        <div class="is-active-left is-active-left-transition" :class="{['is-active'] : roomType === 1}"></div>
      </div>
      <div class="header-right" @click="changeRoomType(2)">
        <div class="content">钟点房</div>
        <div class="is-active-right is-active-left-transition" :class="{['is-active'] : roomType === 2}"></div>
      </div>
    </div>
    <div 
      class="tab-city tab-row hue-base-arrow-right"
      @click="toChooseCity()">
      <span class="tab-row--header">目的地</span>
      <span>{{city.cityName}}</span>
    </div>
    <div class="tab-date hue-base-arrow-right tab-row m-larger"
    :style="{display: roomType === 1 ? '' : 'none'}"
    @click="toChooseDate()">
      <span class="tab-row--header">时间</span>
      <div class="tab-date--content-wrapper">
        <div class="tab-date--content">
          <span class="tab-date--date"> {{checkinDate | dateToMMDD}} </span>
          <span class="tab-date--desc"> 周{{checkinDate | dateToDay}}入住 </span>
        </div>
        <div class="tab-date--content">
          <span class="tab-date--date"> {{checkoutDate | dateToMMDD}} </span>
          <span class="tab-date--desc"> 周{{checkoutDate | dateToDay}}离店 </span>
          <span class="tab-date--desc"> {{checkDays}}晚 </span>
        </div>
      </div>
    </div>
    <div class="tab-date hue-base-arrow-right tab-row m-larger" 
    :style="{display: roomType === 1 ? 'none' : ''}"
    @click="toChooseDate()">
      <span class="tab-row--header">时间</span>
      <div class="tab-date--content-wrapper">
        <div class="tab-date--content m-date-single">
          <span class="tab-date--date"> {{checkinDate | dateToMMDD}} </span>
          <span class="tab-date--desc"> 周四入住 </span>
        </div>
      </div>
    </div>
    <div class="tab-search tab-row hue-base-arrow-right" v-show="!keyword">
      <span class="tab-row--header">搜索</span>
      <span class="my-around" style="display:none;">我的附近</span>
      <span class="tab-search--desc">位置/酒店/关键词</span>
    </div>
    <div class="tab-search tab-row is-active" v-show="keyword">
      <span class="tab-row--header">搜索</span>
      <span class="tab-row--keyword">{{keyword}}</span>
      <span class="tab-search-clear hue-base-icon-base" @click="deleteKeyword">✘</span>
    </div>
    <div class="tab-btn">
      <button type="button" class="hue-base-button-block-btn-green">查找酒店</button>
    </div>
  </div>
</template>

<script>
  import { LOCATION } from '@/config/data'
  import { mapState, mapMutations } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'search',
    data () {
      return {}
    },
    mounted () {
      this.getLocationInfo(this.getUrlInfo)
    },
    watch: {
      route (newRoute) {
        this.CITY({
          cityName: newRoute.query['cityName'],
          cityId: newRoute.query['cityId']
        })
        if (newRoute.query['keyword']) {
          this.KEYWORD(newRoute.query['keyword'])
        } else {
          this.KEYWORD('')
        }
      }
    },
    computed: mapState({
      // 映射 this.count 为 store.state.count
      city: 'city',
      route: 'route',
      roomType: 'roomType',
      location: 'location',
      keyword: 'keyword',
      checkinDate (state) {
        return state.checkinDate
      },
      checkoutDate (state) {
        return state.checkoutDate
      },
      checkDays (state) {
        return (moment(state.checkoutDate).format('X') - moment(state.checkinDate).format('X')) / (24 * 60 * 60)
      }
    }),
    methods: {
      ...mapMutations([
        'ROOM_TYPE', // 映射 this.ROOM_TYPE() 为 this.$store.commit('ROOM_TYPE')
        'CITY',
        'LOCATION',
        'IS_SHOW_CITY_BOX',
        'KEYWORD',
        'IS_SHOW_DATE_PICKER'
      ]),
      toChooseCity () {
        this.IS_SHOW_CITY_BOX(true)
      },
      changeRoomType (roomType) {
        this.ROOM_TYPE(roomType)
      },
      toChooseDate () {
        this.IS_SHOW_DATE_PICKER(true)
      },
      getLocationInfo (getUrlInfo) {
        let _self = this
        setTimeout(function getLacationInfo () {
          // 模拟异步获取当前定位信息
          let locationInfo = LOCATION.data
          _self.LOCATION(locationInfo)
          getUrlInfo.call(_self)
        }, 200)
      },
      getUrlInfo () {
        let query = this.route.query
        let city, keyword
        if (query['cityId']) {
          city = {
            cityName: query['cityName'],
            cityId: query['cityId']
          }
          if (query['keyword']) {
            keyword = query['keyword']
          }
        } else {
          city = {
            cityName: this.location['name'],
            cityId: this.location['id']
          }
          keyword = this.location['address']
        }
        this.CITY(city)
        if (keyword) {
          this.KEYWORD(keyword)
        }
      },
      deleteKeyword () {
        this.KEYWORD('')
      }
    }
  }
</script>

<style scope lang="sass">
  @import 'src/style/common'
  .search-box
    background: #fff;
    border-top-left-radius: px2rem(6px);
    border-top-right-radius: px2rem(6px);
    @include size('margin',-110px 20px 0px 20px);
    border: 1px solid #f3f3f3;
    border-radius: px2rem(10px);
    .search-header
      border-bottom: 1px solid #f3f3f3;
      display: flex;
      height: px2rem(110px);
      line-height: px2rem(110px);
      color: #333;
      position: relative;
      background: #fff;
      .header-left, .header-right
        display: block;
        flex: 1;
        text-align: center;
        position: relative;
        background: #fff;
        font-size: px2rem(34px);
        // @include font-size(16px);
        .is-active
          display: block;
          position: absolute;
          bottom: 0;
          border-radius: px2rem(6px);
          height: px2rem(10px);
          width: 80%;
          background-color: #06c1ae;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-transition: -webkit-transform .3s cubic-bezier(.25,.46,.45,.94);
          transition: -webkit-transform .3s cubic-bezier(.25,.46,.45,.94);
          transition: transform .3s cubic-bezier(.25,.46,.45,.94);
          transition: transform .3s cubic-bezier(.25,.46,.45,.94),-webkit-transform .3s cubic-bezier(.25,.46,.45,.94);
          -webkit-perspective: 1000;
          perspective: 1000;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
      .header-left
        padding-left: px2rem(64px);
        .content
          padding-right: px2rem(20px);
        .is-active-left
          right: 0;
      .header-right
        padding-right: px2rem(64px);
        .content
          padding-left: px2rem(20px);
        .is-active-right
          left: 0;
    .search-header:after
      content: "";
      display: block;
      position: absolute;
      left: 50%;
      top: 20%;
      height: 60%;
      width: 1px;
      border-left: 1px solid #f3f3f3;
    .tab-row
      border-bottom: 1px solid #f3f3f3;
      margin: 0 px2rem(24px);
      height: px2rem(110px);
      line-height: px2rem(110px);
      display: flex;
      font-size: px2rem(34px);
      color: #333;
      position: relative;
      .tab-row--header
        display: block;
        width: px2rem(100px);
        margin-right: px2rem(26px);
        font-size: px2rem(30px);
        color: #999;
      .tab-search--desc
        font-size: px2rem(30px);
        color: #999;
        display: inline-block;
        margin-left:  px2rem(35px);
      .tab-search-clear
        position: absolute;
        display: block;
        right: 0;
        font-family: hue icon base;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        font-weight: 400;
        font-style: normal;
        border: 0;
        width: .3rem;
        height: .3rem;
        -webkit-transform: none;
        transform: none;
        margin-right: .2rem;
        color: #666;
        top: 0;
    .tab-date
      height: px2rem(150px);
      line-height: px2rem(150px);
      .tab-date--content-wrapper
        line-height: 1;
        padding: px2rem(25px) 0;
        -webkit-box-flex: 1;
        flex: 1;
        .tab-date--content
          line-height: px2rem(50px);
          .tab-date--date
            display: inline-block;
            padding-right: px2rem(20px);
          .tab-date--desc
            font-size: px2rem(24px);
            color: #999;
            display: inline-block;
            margin-right: px2rem(10px);
        .m-date-single   
          line-height: px2rem(110px);
    .tab-btn
      padding: px2rem(16px 24px);
      .hue-base-button-block-btn-green
        height: px2rem(80px);
</style>
