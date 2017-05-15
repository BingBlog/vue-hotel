<template>
  <div class="vue-calendar" data-index="0">
      <div class="vue-calendar-backdrop vue-component-calendar-backdrop-transition"></div>
      <div class="vue-calendar-content vue-component-calendar-content-transition" id="vueCalendarTemplate">
        <div class="vue-calendar-content-title-wrapper" id="topHeight1">
            <div class="text">请选择入离日期</div>
            <div class="vue-component-calendar-complete-button">
                <a href="javascript:;" @click="asureClick">完成</a>
            </div>
        </div>
        <div class="week-bar" id="topHeight2">
            <ul>
              <li class="weekend">日</li>
              <li>一</li>
              <li>二</li>
              <li>三</li>
              <li>四</li>
              <li>五</li>
              <li class="weekend">六</li>
            </ul>
        </div>
        <div class="month-bar-fixed" id="fixedBarEle" style="opacity: 0; transform: translate(0px, 0px);"></div>
        <div id="scrollPanelWrapper" ref="scrollPanelWrapper">
          <div class="vue-calendar-date-wrapper" id="scrollPanel">
              <div class="month-panel" v-for="(month, index) in monthList" :data-index="index">
                  <div class="month-bar first-month-bar selected-month" :id="'monthBar-' + index">{{month.month}}</div>
                  <div class="month-list">
                    <ul>
                      <template v-for="(dayItem, day) in month.daysList">
                        <li class="tips-hook border-radius"
                        :class="{
                          'disabled' : dayItem.time < currentDayTime,
                          'selected-start' : dayItem.time === startDate.time,
                          'selected-end' : dayItem.time === endDate.time,
                          'selected-line' : (dayItem.time > startDate.time && dayItem.time < endDate.time)
                          }"
                        :date-sec="dayItem.time"
                        :data-date-format="dayItem.format"
                        @click="dayItemClick(dayItem, dayItem.time < currentDayTime)">
                          <span class="dd">{{dayItem.day}}</span>
                          <i></i>
                          <span class="holiday"></span>
                        </li>
                      </template>
                    </ul>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div class="vue-component-tip-helper-common vue-component-tip-helper-above vue-component-tip-slide-up-transition" style="display: none; visibility: hidden;">
          <div class="vue-component-tip-bar-above vue-component-tip-bar-common vue-component-tip-slide-up-transition" style="display: none; margin-left: 0px; margin-right: 0px;"> </div>
      </div>
      <div class="vue-component-tip-helper-common vue-component-tip-helper-below vue-component-tip-slide-below-transition" style="display: none; visibility: hidden;">
          <div class="vue-component-tip-bar-below vue-component-tip-bar-common vue-component-tip-slide-below-transition" style="display: none; margin-left: 0px; margin-right: 0px;"> </div>
      </div>
      <div class="vue-component-tip-triangles-above vue-component-tip-triangles-common" style="display: none;">&nbsp;</div>
      <div class="vue-component-tip-triangles-below vue-component-tip-triangles-common" style="display: none;">&nbsp;</div>
  </div>
</template>
<script>
  import _moment from 'moment'
  import BScroll from 'better-scroll'
  const formatZh = 'YYYY年MM月DD日'
  const formatEn = 'YYYY-MM-DD'
  export default {
    name: 'Calender',
    props: {
      date: {
        type: Date, // 当前日期
        required: true
      },
      monthNumber: Number, // 显示多少个月可供选择
      onlyOne: Boolean, // 仅选择一个日期
      isShowDatePicker: Boolean
    },
    created () {
      this.initData()
      // 根据传入的当前时间 初始化化 startDate 和 endDate
      this.initStartAndEndDays(this.date)
    },
    mounted () {
      this.$refs.scrollPanelWrapperBox
    },
    data () {
      return {
        startDate: {},
        endDate: {},
        monthList: []
      }
    },
    computed: {
      currentDayTime () {
        return _moment(_moment(this.date).format(formatEn)).format('X')
      }
    },
    watch: {
      onlyOne (newOnlyOne) {
        if (newOnlyOne) {
          this.endDate = {}
        } else {
          this.initStartAndEndDays(this.startDate.format)
          this.$emit('asureEvent', {
            startDate: this.startDate,
            endDate: this.endDate
          })
        }
      },
      isShowDatePicker (newIsShowDatePicker) {
        if (newIsShowDatePicker && !this.scrollPanelWrapper) {
          this.scrollPanelWrapper = new BScroll(this.$refs.scrollPanelWrapper, {
            probeType: 3,
            click: true
          })
          this.scrollPanelWrapper.scrollTo(0, 0)
        }
      }
    },
    methods: {
      initData () {
        let date = this.date
        let monthList = []
        let monthNumber = this.monthNumber
        for (let i = 0; i < monthNumber; i += 1) {
          let month = _moment(date).add(i, 'M').format('YYYY年MM月')
          let daysNumber = _moment(month, 'YYYY年MM月').daysInMonth()
          let firstDayOfMonth = _moment(month + '1日', formatZh).format('e')
          let daysList = []
          for (let k = 0; k < firstDayOfMonth; k++) {
            daysList.push({
              time: '',
              format: ''
            })
          }
          for (let j = 1; j <= daysNumber; j++) {
            let dayFormat = month + j + '日'
            daysList.push(this.itemDay(dayFormat, j))
          }
          let preFixLength = daysList.length
          for (let m = 0; m < (7 - preFixLength % 7); m++) {
            daysList.push({
              time: '',
              format: ''
            })
          }
          monthList.push({
            month: month,
            daysNumber: daysNumber,
            daysList: daysList
          })
        }
        this.monthList = monthList
      },
      dateSec (dayFormatZh) {
        return _moment(dayFormatZh, formatZh).format('X')
      },
      dataDateFormat (dayFormatZh) {
        return _moment(dayFormatZh, formatZh).format(formatEn)
      },
      itemDay (dayFormat, day) {
        return {
          time: this.dateSec(dayFormat),
          format: this.dataDateFormat(dayFormat),
          day: day
        }
      },
      initStartAndEndDays (currentDayEn) {
        let currentDay = _moment(currentDayEn)
        if (this.onlyOne) {
          this.startDate = this.itemDay(currentDay.format(formatZh), currentDay.format('DD'))
          this.endDate = {}
        } else {
          let nextDay = _moment(currentDayEn).add(1, 'd')
          this.startDate = this.itemDay(currentDay.format(formatZh), currentDay.format('DD'))
          this.endDate = this.itemDay(nextDay.format(formatZh), nextDay.format('DD'))
        }
      },
      dayItemClick (item, disabled) {
        if (disabled) {
          return
        }
        console.log(item)
        let startTime = this.startDate.time
        let endTime = this.endDate.time
        // 钟点房
        if (this.onlyOne) {
          console.log('ok')
          this.startDate = item
          this.endDate = {}
        } else {
          console.log('22')
          if (startTime && endTime) {
            this.startDate = item
            this.endDate = {}
          } else if (startTime && !endTime) {
            console.log('33')
            if (item.time <= startTime) {
              this.startDate = item
            } else {
              this.endDate = item
            }
          } else if (!startTime && !endTime) {
            this.startDate = item
          }
        }
      },
      asureClick () {
        let startTime = this.startDate.time
        let endTime = this.endDate.time
        if (this.onlyOne && startTime) {
          this.$emit('asureEvent', {
            startDate: this.startDate,
            endDate: {}
          })
        } else {
          if (startTime && endTime) {
            this.$emit('asureEvent', {
              startDate: this.startDate,
              endDate: this.endDate
            })
          }
        }
        console.log(this.startDate, this.endDate)
      }
    }
  }
</script>
<style lang="sass">
  @import 'src/style/common'
  .vue-calendar-backdrop
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.7);
    z-index: 999;
  .vue-calendar-content
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75%;
    overflow: hidden;
    z-index: 1000;
    font-size: px2rem(30px);
    .vue-calendar-content-title-wrapper:after
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #d9d9d9;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    .vue-calendar-content-title-wrapper
      background: #fff;
      z-index: 1003;
      height: px2rem(90px);
      line-height: px2rem(90px);
      position: relative;
      .text
        float: left;
        padding-left: px2rem(20px);
        color: #666;
        font-size: px2rem(32px);
      .vue-component-calendar-complete-button
        float: right;
        margin-right: px2rem(20px);
        a
          color: #2eb6a8;
          font-size: px2rem(30px);
          text-decoration: none;
          @include size('padding', 10 20);
          border: .02rem solid #2eb6a8;
          border-radius: px2rem(6px);
    .week-bar:after
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #d9d9d9;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    .week-bar
      height: px2rem(60px);
      line-height: px2rem(60px);
      position: relative;
      background: #fff;
      z-index: 1001;
      ul
        display: flex;
        li
          color: #666;
          -webkit-box-flex: 1;
          flex: auto;
          list-style: none;
          text-align: center;
        .weekend
          color: #fa967f;
    .month-bar-fixed
      overflow: visible;
      text-align: center;
      height: px2rem(60px);
      line-height: px2rem(6px);
      width: 100%;
      position: fixed;
      top: px2rem(150px);
      background: #fafafa;
      z-index: 1000;
    .month-bar-fixed:after
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #d9d9d9;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    #scrollPanelWrapper
      position: relative;
      bottom: 0;
      height: 85%;
      overflow: hidden;
      .vue-calendar-date-wrapper
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        overflow: auto;
        position: relative;
        -webkit-transform: translateZ(0);
        .month-bar:after
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid #d9d9d9;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        .month-bar
          text-align: center;
          height: px2rem(60px);
          line-height: px2rem(60px);
          width: 100%;
          position: relative;
          background: #fafafa;
      .month-list
        ul
          overflow: hidden;
          li
            list-style: none;
        li
          display: inline-block;
          width: 14.286%;
          border-bottom: 1px solid #eee;
          text-align: center;
          position: relative;
          height: px2rem(100px);
          line-height: px2rem(100px);
          color: #333;
          .dd
            position: relative;
            display: inline-block;
            top: px2rem(-15px);
        li.disabled
          color: #a2a2a2;
        li.border-radius
          border-radius: px2rem(6px)!important;
        li.selected-start, li.selected-end
          height: px2rem(100px)!important;
          line-height: px2rem(100px)!important;
          color: #fff;
          background: #2eb6a8;
          border-bottom: none;
          border-radius: 0 .06rem .06rem 0;
          i:after
            position: absolute;
            top: px2rem(20px);
            left: 0;
            font-size: px2rem(24px);
            font-style: normal;
            text-align: center;
            width: 100%;
        li.selected-start
          i:after
            content: "\5165\4F4F";
        li.selected-end
          i:after
            content: "\79BB\5E97";
        li.selected-line
          background: #e0f4f2;
          color: #333;
          height: px2rem(100px)!important;
          line-height: px2rem(100px)!important;
        li.selected-line:before
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          border-bottom: 1px solid #d9d9d9;
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
</style>
