<template>
  <div class="search-query-page--search-bar">
    <span class="search-query-page--search-bar--btn" type="span" @click="CancelBtnClick">
      <i class="hue-base-icon-base">✗</i>
    </span>
    <label class="search-box">
      <i class="hue-base-icon-base search-box--icon">Ƣ</i>
      <input 
        class="search-box--input" 
        type="text" 
        placeholder="位置／酒店名／关键词"
        @input="queryWord"
        ref="inputEl"
        >
    </label>
    <div class="search-btn" @click="searchKeyword">搜索</div>
  </div>
</template>
<script>
  export default {
    name: 'searchBar',
    data () {
      return {}
    },
    watch: {
      resetInput (newResetInput) {
        this.emptyInput()
      }
    },
    props: {
      resetInput: Boolean,
      city: Object
    },
    methods: {
      queryWord (e) {
        // uuid=5FCDB68D168F8554350D79A2F8918E950BB4C0811BA23BF856533585029658BD&input=%E4%B8%89
        let queryWord = e.target.value
        let queryUrl = '/search/suggest/' + this.city.cityId
        if (!queryWord.trim()) {
          this.$emit('responseData', 'emptyInput')
          return
        }
        this.$http.get(queryUrl, {
          params: {
            uuid: '5FCDB68D168F8554350D79A2F8918E950BB4C0811BA23BF856533585029658BD',
            input: queryWord.trim()
          }
        }).then(
          this.getQueryData
        )
        .catch(function (error) {
          console.log(error)
        })
      },
      searchKeyword () {
        console.log('111')
        let queryWord = this.$refs.inputEl.value
        if (queryWord.trim()) {
          this.$emit('responseData', queryWord)
        }
      },
      getQueryData (response) {
        if (response.data && response.data.data) {
          this.$emit('responseData', response.data.data)
        }
      },
      CancelBtnClick () {
        if (this.$refs.inputEl.value) {
          this.emptyInput()
        } else {
          this.$emit('responseData', 'close')
        }
      },
      emptyInput () {
        this.$refs.inputEl.value = ''
        this.$emit('responseData', 'emptyInput')
      }
    }
  }
</script>
<style lang="sass">
  @import 'src/style/common'
  .search-query-page--search-bar
    position: relative;
    background: #fafafa;
    width: 100%;
    height: px2rem(90px);
    display: -webkit-box;
    display: flex;
    @include size('padding', 10px 24px 10px 0px);
    font-size: px2rem(30px)
    .search-query-page--search-bar--btn
      border: none;
      width: px2rem(100px);
      font-size: px2rem(60px);
      color: #06c1ae;
      text-align: center;
    .search-box
      border: 1px solid #e5e5e5;
      border-radius: px2rem(2px);
      background: #fff;
      height: px2rem(70px);
      line-height: px2rem(70px);
      width: 100%;
      @include size('padding', 10px 20px)
      display: -webkit-box;
      display: flex;
      .search-box--icon
        padding-right: px2rem(20px);
        color: #999;
      .search-box--icon, .search-box--input
        display: block;
        height: .5rem;
        line-height: .55rem;
    .search-btn
      display: inline-block;
      float: right;
      width: px2rem(100px);
      line-height: px2rem(70px);
      margin-left: px2rem(30px);
</style>
