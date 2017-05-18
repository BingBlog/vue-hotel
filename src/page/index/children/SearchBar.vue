<template>
  <div class="search-page--search-bar">
    <button class="search-page--search-bar--btn" type="button">
      <i class="hue-base-icon-base" @click="CancelBtnClick">✗</i>
    </button>
    <label class="header-search-box">
      <i class="hue-base-icon-base search-box--icon">Ƣ</i>
      <input ref="inputEl" class="search-box--input" type="text" @input="queryWord" placeholder="位置／酒店名／关键词">
    </label>
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
      resetInput: Boolean
    },
    methods: {
      queryWord (e) {
        let queryWord = e.target.value
        let queryUrl = '/area/search/' + queryWord
        if (!queryWord.trim()) {
          this.$emit('responseData', 'emptyInput')
          return
        }
        this.$http.get(queryUrl).then(
          this.getQueryData
        )
        .catch(function (error) {
          console.log(error)
        })
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
  .search-page--search-bar
    position: relative;
    background: #fafafa;
    width: 100%;
    height: px2rem(90px);
    display: -webkit-box;
    display: flex;
    @include size('padding', 10 24 10 0);
    top: 0;
    .search-page--search-bar--btn
      border: none;
      width: px2rem(100px);
      font-size: px2rem(60px);
      color: #06c1ae;
      text-align: center;
    .header-search-box
      border: 1px solid #e5e5e5;
      border-radius: px2rem(20px);
      background: #fff;
      height: px2rem(70px);
      line-height: px2rem(70px);
      width: 100%;
      @include size('padding', 10 20)
      display: -webkit-box;
      display: flex;
      .search-box--icon, .search-box--input
        font-size: px2rem(30px);
        display: block;
        height: px2rem(50px);
        line-height: px2rem(55px);
      .search-box--icon
        padding-right: px2rem(2px);
        color: #999;
      .search-box--input
        width: 100%;
</style>
