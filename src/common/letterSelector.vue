<template>
  <div class="list-bar list-bar-transition" v-show="isShow">
    <div class="list-bar-inner">
      <div class="list-bar-letter"
        v-for="letter in lettersConfig"
        @click="itemClick(letter)"> {{letter}}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'letteSelector',
    data () {
      return {

      }
    },
    props: {
      lettersConfig: Array
    },
    computed: {
      isShow () {
        return this.lettersConfig.length > 0
      }
    },
    methods: {
      itemClick (letter) {
        this.$emit('itemClick', letter)
      }
    }
  }
</script>
<style lang="sass">
  @import 'src/style/common'
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
