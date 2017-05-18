<template>
  <div class="search-query-page search-query-page-transition" v-show="isShowQuerySelector">
    <search-bar
      :city="city"
      :resetInput="isShowQuerySelector"
      v-on:responseData="queryResponseData"
    ></search-bar>
    <div class="search-query-page--search-body">
      <div class="search-query-page--content"
        v-show="!searchResultData.length">
        <div class="search-query-page--group search-query-page--history">
          <div class="search-query-page--group-title">
            <h2 class="search-query-page--group-title--title">
              <img class="icon-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAA/UlEQVR4AZ2VR0LDQAxFRfPaBxvWyXGcG9DhHSJbOADtKvaQHb2K9CZX/eca522mSGLDAYFjHsj5GJOPn44JHEhTSMmIKJYnMtI6tU+O1pDTLxf3uEBbcMGeVYdoS4ZbOqdoB87W1R5q+RxDFb3VCBeoZZxquZiPPBnaVR6TjVUSokuOJEJAPfKYIJy45VPhzi3fC9EtR+ETLeNaxxlfqeazUn5Vm08jR7cchfty+Wasv4yv9QN2gjo5FYJbPhQSRi41ktiN0ZbMbsm2RFJbDNqyXgg5c5chfwF0l15b9OuHrqBf324GFfM+YlDRbkyjO+GRgq8xxfjphEAiJv/Sh5QnGJAxggAAAABJRU5ErkJggg==">
              历史记录
            </h2>
            <span type="span" class="search-query-page--group-title--btn">
              <img class="icon-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAAAAAAeW/F+AAAAAnRSTlMAAHaTzTgAAAAsSURBVHgBYxg0YCYQkC49EwsgIE1VN6PySJUGEyCMW3pUmrphjgIISw88AAADe2kxJv+3bgAAAABJRU5ErkJggg==">
              清空
            </span>
          </div>
          <div class="search-query-page--group-content"> 
            <ul class="search-query-page--group-content--list"> 
              <li class="search-query-page--group-content--item"> 
                <span type="span" class="search-query-page--group-content--btn">北京站</span>
              </li>
              <li class="search-query-page--group-content--item">
                <span type="span" class="search-query-page--group-content--btn">温泉酒店</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="search-query-page--group search-query-page--expand" v-for="hotType in hotwordData">
          <div class="search-query-page--group-title">
            <h2 class="search-query-page--group-title--title">
              <img class="icon-img" :src="hotType.iconUrl">
              {{hotType.title}}
            </h2>
            <span type="span" class="search-query-page--group-title--btn search-query-page--group-title--btn-primary"
            :class="{
              'hue-base-arrow-down': itemIsShow(hotType.dataType) ? false : true,
              'hue-base-arrow-up'  : itemIsShow(hotType.dataType) ? true : false,
              }"
            v-show="!hotType.hasMore && hotType.items.length > 8"
            @click="toggleMore(hotType.dataType)"
            >
              {{itemIsShow(hotType.dataType) ? '收起' : '展开'}}
            </span>
            <span type="span" class="search-query-page--group-title--btn hue-base-arrow-right search-query-page--group-title--btn-primary"
            v-show="hotType.hasMore"
            @click="toQueryMore(hotType.dataType)"
            >
            更多
            </span>
          </div>
          <div class="search-query-page--group-content">
            <ul class="search-query-page--group-content--list">
              <template v-for="(item, index) in hotType.items">
                <li class="search-query-page--group-content--item"
                  @click="itemClick(item)"
                  v-if="itemIsShow(hotType.dataType, 8, index)">
                  <span type="span" class="search-query-page--group-content--btn">{{item.name}}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <template v-if="searchResultData.length > 0">
        <div class="result-item"
          v-for="item in searchResultData"
          @click="searchResultItemClick(item)"
        >
          <div class="result-item-name">{{item.keyword}}</div>
          <div class="result-item-tag">{{item.category}}</div> 
        </div>
      </template>
    </div>  
    <div class="search-empty" style="display: none;"> 查找 "" </div>
    <div class="search-page-all search-page-all-transition" v-show="isShowSearchPage">
      <div class="search-page-all-left"
        v-if="searchMoreHotwords.length > 0"
        >
        <template v-for="(item, index) in searchMoreHotwords">
          <div class="search-page-all-left-item"
            :class="{'search-page-all-left-item-hover' : index === activeLeftIndex}"
            @click="searchPageLeftItemClick(index)"
          > {{item.name}} </div>
        </template>
      </div>
      <div class="search-page-all-right"
        :class="{'search-page-all-right-wider' : searchMoreHotwords.length === 0}"
        v-if="searchMoreRightData.length > 0"
        ref="rightBody"
        >
        <div id="list" class="list">
          <div class="list-content" style="display:none;"> 全部 </div>
          <div v-for="(item, n) in searchMoreRightData">
            <div class="list-title"
              v-if="n === 0 || n > 0 && item.pinyin.charAt(0).toUpperCase() !== searchMoreRightData[n - 1].pinyin.charAt(0).toUpperCase()"
              :class="['list-title-' + item.pinyin.charAt(0).toUpperCase()]"
              :ref="'list-title-' + item.pinyin.charAt(0).toUpperCase()"
            >{{item.pinyin.charAt(0).toUpperCase()}}
            </div>
            <div class="list-content"
              @click="searchPageRightItemClick(item)"
            > {{item.name}}</div> 
          </div> 
        </div> 
      </div> 
    </div>
  </div>
</template>
<script>
import searchBar from './searchBar'
import { mapState, mapMutations } from 'vuex'
import BScroll from 'better-scroll'
import {ApiSearchHotwordCity, ApiSearchMoreHotwordCity} from '@/config/API'
const onlyOneLevelType = [4, 5, 6] // 景点 学校 医院
export default {
  name: 'QuerySelector',
  data () {
    return {
      hotwordData: [],
      history: {},
      activeDataTypes: [],
      searchMoreHotwords: [],
      activeLeftIndex: 0,
      isShowSearchPage: false,
      searchMoreRightData: [],
      searchResultData: []
    }
  },
  props: {
    scrollLetter: ''
  },
  watch: {
    city (newCity) {
      this.requestHotwordData(newCity)
    },
    searchMoreRightData (newSearchMoreRightData) {
      // 根据右边数据计算当前要展示的字母列表
      let letters = newSearchMoreRightData.reduce((letters, item, index) => {
        let letter = item.pinyin.charAt(0).toUpperCase()
        if (letters.indexOf(letter) === -1) {
          letters.push(letter)
        }
        return letters
      }, [])
      this.LETTERS_CONFIG(letters)
      // 每当右边的数据更新后要重新绑定滚动组件
      if (newSearchMoreRightData.length > 0) {
        this.$nextTick(() => {
          this.scrollRightBody = new BScroll(this.$refs.rightBody, {
            probeType: 3,
            click: true
          })
          console.log('aa')
          this.scrollRightBody.on('scroll', (pos) => {
            console.log(pos.x + '~' + pos.y)
          })
          this.scrollRightBody.scrollTo(0, 0)
        })
      }
    },
    scrollLetter (newScrollLetter) {
      console.log(newScrollLetter)
      if (newScrollLetter && this.searchMoreRightData.length > 0) {
        if (this.$refs['list-title-' + newScrollLetter][0]) {
          console.log(this.$refs['list-title-' + newScrollLetter])
          this.scrollRightBody.scrollToElement(this.$refs['list-title-' + newScrollLetter][0], 200, 0)
        }
      }
    }
  },
  computed: mapState({
    isShowQuerySelector: 'isShowQuerySelector',
    city: 'city',
    keyword: 'keyword'
  }),
  methods: {
    ...mapMutations([
      'IS_SHOW_QUERY_SELETOR',
      'KEYWORD',
      'LETTERS_CONFIG'
    ]),
    requestHotwordData (city) {
      console.log('getHotwordData')
      let url = ApiSearchHotwordCity + city.cityId
      console.log(url)
      this.$http.get(url, {
        params: {
          reqType: 0,
          version_name: 999.9
        }
      }).then(
        this.getHotwordData
      )
    },
    getHotwordData (response) {
      if (response.data && response.data.data) {
        this.hotwordData = response.data.data.itemTerms
      }
    },
    itemClick (item) {
      this.KEYWORD(item.name)
      this.IS_SHOW_QUERY_SELETOR(false)
    },
    toggleMore (dataType) {
      let activeDataTypes = this.activeDataTypes
      let index = activeDataTypes.indexOf(dataType)
      if (index > -1) {
        activeDataTypes.splice(index, 1)
      } else {
        activeDataTypes.push(dataType)
      }
      this.activeDataTypes = activeDataTypes
    },
    itemIsShow (dataType, termLimit, index) {
      let activeDataTypes = this.activeDataTypes
      if (index < termLimit) {
        return true
      }
      if (activeDataTypes.indexOf(dataType) > -1) {
        return true
      } else {
        return false
      }
    },
    toQueryMore (dataType) {
      let url = ApiSearchMoreHotwordCity + this.city.cityId
      this.$http.get(url, {
        params: {
          reqType: dataType,
          version_name: 999.9
        }
      }).then(
        this.getMoreHotwordData
      )
    },
    getMoreHotwordData (response) {
      if (response.data && response.data.data && response.data.data.items.length > 0) {
        if (onlyOneLevelType.indexOf(response.data.data.reqType) > -1) {
          this.isShowSearchPage = true
          this.searchMoreHotwords = []
          this.searchMoreRightData = response.data.data.items
        } else {
          this.isShowSearchPage = true
          this.searchMoreHotwords = response.data.data.items
          this.searchPageLeftItemClick(0)
        }
      }
    },
    searchPageLeftItemClick (index) {
      this.activeLeftIndex = index
      if (this.searchMoreHotwords[index] && this.searchMoreHotwords[index].subItems.length > 0) {
        this.searchMoreRightData = this.searchMoreHotwords[index].subItems
      }
    },
    searchPageRightItemClick (item) {
      this.itemClick(item)
      this.searchMoreRightData = []
      this.isShowSearchPage = false
    },
    queryResponseData (response) {
      if (response === 'emptyInput') {
        this.searchResultData = []
      } else if (response === 'close') {
        this.searchResultData = []
        this.IS_SHOW_QUERY_SELETOR(false)
      } else if (typeof response === 'string') {
        this.itemClick({
          name: response
        })
      } else {
        this.searchResultData = response
      }
    },
    searchResultItemClick (item) {
      this.itemClick({
        name: item.keyword
      })
    }
  },
  components: {
    searchBar
  }
}
</script>
<style lang="sass">
@import 'src/style/common'
.search-query-page
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  .search-query-page--search-body
    position: relative;
    height: 100%;
    width: 100%;
    padding-bottom: px2rem(90px);
    overflow-x: hidden;
    overflow-y: scroll;
    .search-query-page--content
      width: 100%;
      background-color: #f5f5f5;
      .search-query-page--group
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        background: #fff;
        margin-bottom: px2rem(40px);
        .search-query-page--history
          .search-query-page--group-title--btn
            padding-right: 0;
        .search-query-page--group-title
          height: px2rem(50px);
          line-height: px2rem(50px);
          width: 100%;
          @include size('padding', 0px 24px);
          font-size: px2rem(24px);
          color: #999;
          border-bottom: 1px solid #e5e5e5;
          .search-query-page--group-title--title
            display: inline-block;
          .icon-img
            vertical-align: sub;
            display: inline-block;
            width: px2rem(30px);
            height: px2rem(30px);
          .search-query-page--group-title--btn
            position: relative;
            display: inline-block;
            border: none;
            width: auto;
            height: px2rem(50px);
            float: right;
            padding-right: px2rem(30px);
            padding-left: px2rem(100px);
          .search-query-page--group-title--btn-primary
            color: #06c1ae;
          .hue-base-arrow-up:after
            position: absolute;
            right: 0;
            top: 50%;
            display: block;
            content: "";
            width: .16rem;
            height: .16rem;
            -webkit-transform: translateY(-30%) rotate(45deg);
            transform: translateY(-30%) rotate(45deg);
            border-left: .04rem solid #d9d9d9;
            border-top: .04rem solid #d9d9d9;
    .result-item
      margin-left: px2rem(40px);
      height: px2rem(90px);
      line-height: px2rem(90px);
      border-bottom: 1px solid #e6e6e6;
      font-size: px2rem(30px)
      .result-item-name
        float: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 65%;
        overflow-x: hidden;
      .result-item-tag
        float: right;
        color: #999;
        margin-right: px2rem(40px);
    .search-query-page--group-content
      position: relative;
      font-size: px2rem(26px);
      color: #666;
      .search-query-page--group-content--list
        overflow: hidden;
        .search-query-page--group-content--item
          float: left;
          width: 25%;
          display: inline-block;
          height: px2rem(88px);
          line-height: px2rem(88px);
          @include size('padding', 22px 0px)
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
          .search-query-page--group-content--btn
            width: 100%;
            border: none;
            border-right: 1px solid #e5e5e5;
            height: px2rem(44px);
            line-height: px2rem(44px);
            -webkit-transform: translateX(1px);
            transform: translateX(1px);
            @include size('padding', 0px 10px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
  .search-page-all
    position: fixed;
    z-index: 60;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background: #fff;
    white-space: nowrap;
    font-size: px2rem(30px);
    .search-page-all-left
      display: inline-block;
      height: 100%;
      overflow-y: scroll;
      width: 30%;
      float: left;
      .search-page-all-left-item
        border-bottom: 1px solid #e5e5e5;
        height: px2rem(80px);
        line-height: px2rem(80px);
        color: #666;
        padding-left: px2rem(20px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      .search-page-all-left-item-hover
        background-color: #f7f7f7;
    .search-page-all-right
      display: inline-block;
      height: 100%;
      overflow-y: scroll;
      -webkit-box-flex: 1;
      flex: 1;
      width: 70%;
      .list
        background-color: #f7f7f7;
        position: relative;
        .list-content, .list-title
          position: relative;
          border-bottom: 1px solid #e6e6e6;
        .list-content
          background-color: #f7f7f7;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-bottom: 1px solid #e6e6e6;
          line-height: px2rem(70px);
          @include size('padding', 10px 20px 10px 0px)
          margin-left: px2rem(30px);
        .list-title
          background-color: #e3e3e3;
          font-size: px2rem(24px);
          line-height: px2rem(28px);
          color: #999;
          @include size('padding', 6px 20px);
          border-top: 1px solid #e6e6e6;
    .search-page-all-right-wider
      width: 100%;
</style>
