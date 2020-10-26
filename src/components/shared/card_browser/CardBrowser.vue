<template>
  <div>
    <div class="sm:flex sm:flex-no-wrap">
      <dice-filter class="flex-none mb-4 h-10 sm:pr-4 md:mb-0"></dice-filter>
      <text-filter class="flex-auto h-10"></text-filter>
    </div>
    <!-- TODO: implement the rest of the filters -->
    <card-listing :is-phoenixborn-picker="isPhoenixbornPicker"></card-listing>
  </div>
</template>

<script>
import DiceFilter from './DiceFilter.vue'
import TextFilter from './TextFilter.vue'
import CardListing from './CardListing.vue'

export default {
  name: 'CardBrowser',
  props: {
    isPhoenixbornPicker: Boolean,
  },
  components: {
    DiceFilter,
    TextFilter,
    CardListing,
    PhoenixbornFilters,
  }
}
</script>
