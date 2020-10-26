<template>
  <div class="sm:flex sm:flex-no-wrap">
    <dice-filter class="flex-none mb-4 h-10 sm:pr-4 md:mb-0"></dice-filter>
    <text-filter class="flex-auto h-10"></text-filter>
  </div>
  <p>More filters here...</p>
</template>

<script>
import DiceFilter from './DiceFilter.vue'
import TextFilter from './TextFilter.vue'

export default {
  name: 'CardFilters',
  components: {
    DiceFilter,
    TextFilter,
  }
}
</script>
