<template>
  <div v-show="isShowDatePicker">
    <calender 
    :date="new Date()" 
    :monthNumber="4" 
    v-on:asureEvent="asureClick" 
    :onlyOne="roomType === 1 ? false : true"
    :isShowDatePicker="isShowDatePicker"
    ></calender>
  </div>
</template>
<script>
  import Calender from '@/common/calender'
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'Datepicker',
    data () {
      return {

      }
    },
    computed: mapState({
      isShowDatePicker: 'isShowDatePicker',
      roomType: 'roomType'
    }),
    methods: {
      ...mapMutations([
        'IS_SHOW_DATE_PICKER',
        'CHECK_IN_OUT_INFO'
      ]),
      asureClick (chooseDate) {
        this.IS_SHOW_DATE_PICKER(false)
        this.CHECK_IN_OUT_INFO({
          checkinDate: chooseDate.startDate.format,
          checkoutDate: chooseDate.endDate.format
        })
      }
    },
    components: {
      Calender
    }
  }
</script>
