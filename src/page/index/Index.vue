<template>
  <div class="index">
    <slide></slide>
    <search></search>
    <city></city>
    <datepicker></datepicker>
    <query-selector></query-selector>
  </div>
</template>

<script>
import Slide from '@/page/index/children/Slide'
import Search from '@/page/index/children/Search'
import City from '@/page/index/children/City'
import Datepicker from '@/page/index/children/Datepicker'
import QuerySelector from '@/page/index/children/QuerySelector'
export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    Slide,
    Search,
    City,
    Datepicker,
    QuerySelector
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
</style>
