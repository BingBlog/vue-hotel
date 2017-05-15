<template>
  <div class="index">
    <slide></slide>
    <search></search>
    <city></city>
    <datepicker></datepicker>
  </div>
</template>

<script>
import Slide from '@/page/index/children/Slide'
import Search from '@/page/index/children/Search'
import City from '@/page/index/children/City'
import Datepicker from '@/page/index/children/Datepicker'
export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    Slide,
    Search,
    City,
    Datepicker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
</style>
