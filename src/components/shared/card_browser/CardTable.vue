<template>
  <div v-if="!isDisabled && (!cards || !cards.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No cards found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="cards && cards.length">
    <div class="grid gap-0" :class="[$style['list-columns']]">
      <card-table-row v-for="card of cards" :key="card.stub" :card="card"></card-table-row>
    </div>
    <div v-show="haveNextCards" class="my-4 text-center" ref="scrollLoader">
      <button class="btn btn-blue py-2 px-4" :disabled="isDisabled" @click="$emit('load-more')">
        <span v-if="isDisabled">
          <i class="fas fa-circle-notch fa-spin"></i> Loading...
        </span>
        <span v-if="!isDisabled">
          Load more cards...
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from '/src/utils.js'
import CardTableRow from './CardTableRow.vue'

export default {
  name: 'CardTable',
  props: {
    isPhoenixbornPicker: Boolean,
    isDisabled: Boolean,
    cards: Array,
    haveNextCards: Boolean,
  },
  emits: ['reset-filters', 'load-more'],
  components: {
    CardTableRow,
  },
  mounted () {
    this.debouncedScrollListener = debounce(this.scrollLoadCheck, 100)
    window.addEventListener('scroll', this.debouncedScrollListener)
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.debouncedScrollListener)
  },
  methods: {
    scrollLoadCheck () {
      // Don't process scroll checks when we're already loading stuff
      if (this.isDisabled || !this.haveNextCards) return
      // Check if our scrolling element is within 300 pixels of the bottom of the scroll view (or has passed it)
      const elementBounding = this.$refs.scrollLoader.getBoundingClientRect()
      if (elementBounding.top <= window.innerHeight + 350) {
        this.$emit('load-more')
      }
    },
  },
}
</script>

<style lang="postcss" module>
.list-columns {
  grid-template-columns: auto 1fr auto max-content;
}
</style>
