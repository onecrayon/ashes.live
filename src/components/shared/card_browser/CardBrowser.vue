<template>
  <div>
    <div v-if="isPhoenixbornPicker">
      <phoenixborn-filters></phoenixborn-filters>
    </div>
    <div v-else>
      <card-filters></card-filters>
    </div>
    <card-listing :is-phoenixborn-picker="isPhoenixbornPicker"></card-listing>
  </div>
</template>

<script>
import CardFilters from './CardFilters.vue'
import CardListing from './CardListing.vue'
import PhoenixbornFilters from './PhoenixbornFilters.vue'

export default {
  name: 'CardBrowser',
  props: {
    isPhoenixbornPicker: Boolean,
  },
  components: {
    CardFilters,
    CardListing,
    PhoenixbornFilters,
  }
}
</script>
