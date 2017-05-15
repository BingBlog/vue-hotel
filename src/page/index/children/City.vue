<template>
  <div class="city-search-box" v-show="isShowCityBox">
    <div class="city" ref="cityQueryList" v-show="!isShowCityBody">
      <div>
        <div class="city-search-result">
          <div class="result-item" v-for="query in queryCityList">
            <div class="result-item-name" @click="queryItemClick(query)">
              {{query.areaName}}{{query.areaName ? '，' : ''}}{{query.cityName}}
              <span class="city-color-light">（{{query.cityName}}）</span>
            </div>
            <div class="result-item-tag">{{query.tag}}</div>
          </div>
        </div>
        <div class="city-search-result-empty" style="display: none;">
          未找到相关
          <span class="city-color-weight">“城市／行政区／景点”</span>
          ，请修改后重试
        </div>
      </div>
    </div>
    <div class="city" ref="cityBody" v-show="isShowCityBody">
      <div>
        <div class="city-body">
          <div class="city-current">
            <div class="city-current-title city-title">当前位置</div>
            <div class="city-current-content city-content" style="display: none;"> 定位失败，请点击重试 </div>
            <div class="city-current-content city-content" style="display: none;"> 定位中... </div>
            <div class="city-current-content city-content" @click="locationClick()"> {{locationStr}} </div>
          </div>
          <div class="city-recent">
            <div class="city-current-title city-title">最近访问</div>
            <template v-for="city in hotCity">
              <div class="city-current-content city-content" v-if="city.isOpen" @click="cityItemClick(city)">{{city.name}}</div>
            </template>
          </div>
          <div class="city-hot">
            <div class="city-hot-title city-title">热门城市</div>
              <div class="city-hot-content">
                <template v-for="city in hotCity">
                  <div v-if="city.isOpen" @click="cityItemClick(city)" class="city-hot-content-item city-active">{{city.name}}</div>
                </template>
              </div>
          </div>
          <div id="list" class="list" ref="cityList">
            <div class="list-content" style="display: none;"> 全部 </div>
            <div v-for="(city, index) in cityList">
              <template v-if="isShowCityLetter(city, cityList, index)">
                <div class="list-title" :ref="'list-title-' + city.pinyin.charAt(0).toUpperCase()" :class="['list-title-' + city.pinyin.charAt(0).toUpperCase()]">{{city.pinyin.charAt(0).toUpperCase()}}</div>
              </template>
              <div @click="cityItemClick(city)" class="list-content"> {{city.name}} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="city-header" ref="cityHeader">
      <search-bar v-on:responseData="showResponseData" :isShowCityBody="isShowCityBody"></search-bar>
    </div>
    <div class="list-bar list-bar-transition" v-show="isShowCityBody">
      <div class="list-bar-inner">
        <div class="list-bar-letter" v-for="letter in letters" @click="letterItemClick(letter)"> {{letter}} </div>
      </div>
    </div>
  </div> 
</template>
<script>
  import { HOT_CITY, CITY_LIST } from '@/config/data'
  import { mapState, mapMutations } from 'vuex'
  import SearchBar from '@/page/index/children/SearchBar'
  import BScroll from 'better-scroll'
  export default {
    name: 'City',
    data () {
      return {
        hotCity: [],
        cityList: [],
        letterList: [],
        letters: ['A', 'B', 'C', 'D', 'E', 'F', 'D', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
        queryCityList: [],
        isShowCityBody: true
      }
    },
    components: {
      SearchBar
    },
    mounted () {
      this.getCityList()
    },
    watch: {
      isShowCityBox (isShowCityBox) {
        console.log(isShowCityBox)
        if (isShowCityBox) {
          this.$nextTick(() => {
            this.scrollCityBody = new BScroll(this.$refs.cityBody, {
              probeType: 3,
              click: true
            })
            console.log('aa')
            this.scrollCityBody.on('scroll', (pos) => {
              console.log(pos.x + '~' + pos.y)
            })
            this.scrollCityBody.scrollTo(0, 0)
          })
        }
      }
    },
    computed: mapState({
      isShowCityBox: 'isShowCityBox',
      location: 'location',
      locationStr (state) {
        return [state.location.name, state.location.district, state.location.address].join(',')
      }
    }),
    methods: {
      ...mapMutations([
        'CITY',
        'IS_SHOW_CITY_BOX'
      ]),
      getCityList () {
        setTimeout(this.getCityListInfo, 200)
      },
      getCityListInfo () {
        this.hotCity = HOT_CITY.data
        CITY_LIST.data.sort(function (a, b) {
          return [a.pinyin, b.pinyin].sort().shift() === a.pinyin ? -1 : 1
        })
        this.cityList = CITY_LIST.data
      },
      cityItemClick (city) {
        this.$router.push({
          path: '/',
          query: {
            cityName: city.name, // 所选城市名称
            cityId: city.id // 所选城市ID
          }
        })
        this.IS_SHOW_CITY_BOX(false)
      },
      isShowCityLetter (city, cityList, index) {
        if (index === 0) {
          return true
        } else {
          return city.pinyin.charAt(0).toUpperCase() !== cityList[index - 1].pinyin.charAt(0).toUpperCase()
        }
      },
      letterItemClick (letter) {
        if (document.querySelector('.list-title-' + letter)) {
          console.log(this.$refs['list-title-' + letter])
          this.scrollCityBody.scrollToElement(this.$refs['list-title-' + letter][0], 200, 0, -this.$refs.cityHeader.clientHeight)
        }
      },
      locationClick () {
        let location = this.location
        this.cityItemClick({
          name: location.name,
          id: location.id
        })
      },
      showResponseData (showResponseData) {
        console.log(showResponseData)
        this.displayCityBody()
        if (showResponseData === 'emptyInput') {
        } else if (showResponseData.length > 0) {
          this.queryCityList = showResponseData
          this.displayQueryList()
        } else {
          console.log('emptyResponse')
        }
      },
      displayQueryList () {
        this.isShowCityBody = false
        this.$nextTick(() => {
          this.scrollQueryList = new BScroll(this.$refs.cityQueryList, {
            probeType: 3,
            click: true
          })
          this.scrollQueryList.on('scroll', (pos) => {
            console.log(pos.y)
          })
          this.scrollQueryList.scrollTo(0, 0)
        })
      },
      displayCityBody () {
        this.isShowCityBody = true
      },
      queryItemClick (query) {
        let routeQuery = {}
        this.displayCityBody()
        if (query.areaName) {
          routeQuery = {
            cityName: query.cityName, // 所选城市名称
            cityId: query.cityId, // 所选城市ID
            keyword: query.areaName
          }
        } else {
          routeQuery = {
            cityName: query.cityName, // 所选城市名称
            cityId: query.cityId // 所选城市ID
          }
        }
        this.$router.push({
          path: '/',
          query: routeQuery
        })
        this.IS_SHOW_CITY_BOX(false)
      }
    }
  }
</script>
<style scope lang="sass">
  @import 'src/style/common'
  .city-search-box
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    .city-header
      position: fixed;
      z-index: 41;
      top: 0;
      width: 100%;
      height: px2rem(90px);
      background-color: #d9d9d9;
      line-height: px2rem(40px);
      text-align: center;
    .city
      position: fixed;
      z-index: 40;
      top: 0;
      left: 0;
      height: 100%;
      max-height: 100%;
      width: 100%;
      overflow: hidden;
      color: #333;
      background-color: #d9d9d9;
      perspective: 1000;
      backface-visibility: hidden;
      .city-body, .city-search-result
        position: relative;
        padding-bottom: px2rem(90px);
        height: 100%;
        overflow-y: scroll;
        width: 100%;
        margin-top: px2rem(90px);
        .city-current
          position: relative;
        .city-title
          position: relative;
          background-color: #f7f7f7;
          font-size: px2rem(20px);
          color: #999;
          @include size('padding', 7px 20px 7px 3px);
          border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #d9d9d9;
        .city-content
          position: relative;
          line-height: px2rem(70px);
          @include size('padding', 10px 20px 10px 30px);
          background-color: #fff;
          border-bottom: 1px solid #e6e6e6;
          font-size: px2rem(30px);
        .city-hot
          background-color: #fff;
          .city-hot-content
            padding: .14rem 0;
            .city-hot-content-item
              @include size('margin', 8px 8px 3%);
              @include size('padding', 20px);
              width: 28%;
              display: inline-block;
              height: px2rem(70px);
              font-size: px2rem(30px);
              text-align: center;
              border: 1px solid #e6e6e6;
        .list
          background-color: #fff;
          position: relative;
          .list-content, .list-title
            position: relative;
            border-bottom: 1px solid #e6e6e6;
          .list-content
            line-height: px2rem(70px);
            @include size('padding', 10px 20px 10px 0);
            font-size: px2rem(30px);
            background-color: #fff;
            margin-left: px2rem(30px);
          .list-title
            background-color: #f7f7f7;
            font-size: px2rem(24px);
            line-height: px2rem(28px);
            color: #999;
            @include size('padding', 6px 20px);
            border-top: 1px solid #e6e6e6;
      .city-search-result
        background-color: #fff;
        .result-item
          margin-left: px2rem(40px);
          height: px2rem(90px);
          line-height: px2rem(90px);
          border-bottom: 1px solid #e6e6e6;
          font-size: px2rem(30px);
          .result-item-name
            float: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 65%;
            overflow-x: hidden;
          .city-color-light
            color: #ccc;
          .result-item-tag
            float: right;
            color: #999;
            margin-right: px2rem(40px);
            font-size: px2rem(30px);
    .list-bar
      position: fixed;
      width: px2rem(60px);
      max-height: 85%;
      top: 15%;
      right: 0;
      text-align: right;
      z-index: 100;
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
      .list-bar-inner
        display: inline-block;
        max-height: 100%;
        @include size('padding', 20px 4px);
        background-color: rgba(0,0,0,.2);
        border-radius: px2rem(22px);
        width: px2rem(34px);
        margin-right: px2rem(5px);
        text-align: center;
        .list-bar-letter
          position: relative;
          font-size: px2rem(20px);
          line-height: px2rem(35px);
          color: #fff;
          width: px2rem(60px);
          margin-left: px2rem(-18px);
          text-align: center;
</style>

