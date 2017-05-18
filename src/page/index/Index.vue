<template>
  <div class="index">
    <slide></slide>
    <search></search>
    <city :scrollLetter="scrollLetter"></city>
    <datepicker></datepicker>
    <query-selector :scrollLetter="scrollLetter"></query-selector>
    <letter-selector
      :lettersConfig="lettersConfig"
      v-on:itemClick="letterItemClick"
      >
    </letter-selector>
  </div>
</template>

<script>
import Slide from '@/page/index/children/Slide'
import Search from '@/page/index/children/Search'
import City from '@/page/index/children/City/index'
import Datepicker from '@/page/index/children/Datepicker'
import QuerySelector from '@/common/QuerySelector/index'
import LetterSelector from '@/common/letterSelector'
import { mapState } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      scrollLetter: ''
    }
  },
  computed: mapState({
    lettersConfig: 'lettersConfig'
  }),
  methods: {
    letterItemClick (letter) {
      this.scrollLetter = letter
      console.log(letter)
    }
  },
  components: {
    Slide,
    Search,
    City,
    Datepicker,
    QuerySelector,
    LetterSelector
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
</style>
