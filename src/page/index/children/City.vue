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
      <search-bar v-on:responseData="showResponseData" :resetInput="isShowCityBox"></search-bar>
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
        queryCityList: [],
        isShowCityBody: true,
        letters: []
      }
    },
    props: {
      scrollLetter: String
    },
    components: {
      SearchBar
    },
    mounted () {
      this.getCityList()
    },
    watch: {
      isShowCityBox (isShowCityBox) {
        console.log('isShowCityBox:' + isShowCityBox)
        if (isShowCityBox) {
          // 根据是否显示 CityBox 来确定 letter组件的展示内容
          this.LETTERS_CONFIG(this.letters)
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
        } else {
          this.LETTERS_CONFIG([])
        }
      },
      cityList (newCityList) {
        this.letters = newCityList.reduce((letters, item, index, array) => {
          let letter = item.pinyin.charAt(0).toUpperCase()
          if (letters.indexOf(letter) === -1) {
            letters.push(letter)
          }
          return letters
        }, [])
      },
      scrollLetter (newScrollLetter) {
        if (newScrollLetter && this.isShowCityBox) {
          if (this.$refs['list-title-' + newScrollLetter][0]) {
            console.log(this.$refs['list-title-' + newScrollLetter])
            this.scrollCityBody.scrollToElement(this.$refs['list-title-' + newScrollLetter][0], 200, 0, -this.$refs.cityHeader.clientHeight)
          }
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
        'IS_SHOW_CITY_BOX',
        'LETTERS_CONFIG'
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
      locationClick () {
        let location = this.location
        this.cityItemClick({
          name: location.name,
          id: location.id
        })
      },
      showResponseData (showResponseData) {
        if (showResponseData === 'emptyInput') {
          this.displayCityBody()
        } else if (showResponseData === 'close') {
          console.log('close')
          this.IS_SHOW_CITY_BOX(false)
        } else if (showResponseData.length > 0) {
          this.queryCityList = showResponseData
          this.displayQueryList()
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
        console.log('times')
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
        if (this.isShowCityBox) {
          this.IS_SHOW_CITY_BOX(false)
        }
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
</style>

