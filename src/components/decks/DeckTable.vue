<template>
  <div v-if="!isDisabled && (!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No decks found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="decks && decks.length">
    <deck v-for="deck of decks" :key="deck.id" :deck="deck"></deck>
    <div v-show="haveNextDecks" class="my-4 text-center" ref="scrollLoader">
      <button class="btn btn-blue py-2 px-4" :disabled="isDisabled" @click="$emit('load-more')">
        <span v-if="isDisabled">
          <i class="fas fa-circle-notch fa-spin"></i> Loading...
        </span>
        <span v-if="!isDisabled">
          Load more decks...
        </span>
      </button>
    </div>
</div>
  <div v-else class="text-center text-gray text-2xl py-8 px-4">
    <i class="fas fa-circle-notch fa-spin"></i> Loading...
  </div>
</template>

<script>
import { debounce } from '/src/utils.js'
import Deck from './Deck.vue'

export default {
  name: 'DeckTable',
  props: {
    isDisabled: Boolean,
    decks: Array,
    haveNextDecks: Boolean,
  },
  emits: ['reset-filters', 'load-more'],
  components: {
    Deck,
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
      if (this.isDisabled || !this.haveNextDecks) return
      // Check if our scrolling element is within 300 pixels of the bottom of the scroll view (or has passed it)
      const elementBounding = this.$refs.scrollLoader.getBoundingClientRect()
      if (elementBounding.top <= window.innerHeight + 350) {
        this.$emit('load-more')
      }
    },
  },
}
</script>