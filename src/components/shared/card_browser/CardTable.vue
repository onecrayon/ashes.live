<template>
  <div v-if="!isDisabled && (!cards || !cards.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No cards found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="cards && cards.length">
    <ul>
      <li
        v-for="card of cards" :key="card.stub"
        class="flex flex-no-wrap">
        <div class="flex-grow-0 flex-shrink-0 w-8 p-1 text-center border-b border-gray-light" :title="card.type">
          <i class="fas" :class="[typeIcon(card)]"></i>
        </div>
        <div class="flex-grow p-1 border-b border-gray-light">
          <card-link :card="card"></card-link>
          <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
            ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
          </span>
          <span v-if="card.release.is_phg === false" class="text-gray pl-1">†</span>
        </div>
      </li>
    </ul>
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
import {typeToFontAwesome} from '/src/constants.js'
import {debounce} from '/src/utils.js'
import CardLink from '../CardLink.vue'

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
    CardLink,
  },
  mounted () {
    this.debouncedScrollListener = debounce(this.scrollLoadCheck, 100)
    window.addEventListener('scroll', this.debouncedScrollListener)
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.debouncedScrollListener)
  },
  methods: {
    typeIcon (card) {
      const typeClass = typeToFontAwesome[card.type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    scrollLoadCheck () {
      // Don't process scroll checks when we're already loading stuff
      if (this.isDisabled || !this.haveNextCards) return
      // Check if our scrolling element is within 300 pixels of the bottom of the scroll view (or has passed it)
      const elementBounding = this.$refs.scrollLoader.getBoundingClientRect()
      if (elementBounding.top <= window.innerHeight + 500) {
        this.$emit('load-more')
      }
    },
  },
}
</script>
