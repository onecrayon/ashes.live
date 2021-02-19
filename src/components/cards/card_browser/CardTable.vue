<template>
  <div v-if="!isDisabled && (!cards || !cards.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No cards found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="cards && cards.length">
    <div v-if="galleryStyle === 'list'"
      class="grid gap-0"
      :class="{
        [$style.deckbuilderListColumns]: isDeckbuilderActive,
        [$style.listColumns]: !isDeckbuilderActive,
      }">
      <card-table-row v-for="card of cards" :key="card.stub" :card="card"></card-table-row>
    </div>
    <div v-else class="grid gap-4 grid-flow-row auto-cols-auto" :class="[$style.cardColumns]">
      <card v-for="card of cards" :key="card.stub" :card="card"></card>
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
  <div v-else class="text-center text-gray text-2xl py-8 px-4">
    <i class="fas fa-circle-notch fa-spin"></i> Loading...
  </div>
</template>

<script>
import { debounce } from '/src/utils.js'
import CardTableRow from './CardTableRow.vue'
import Card from '../../shared/Card.vue'

export default {
  name: 'CardTable',
  props: {
    isPhoenixbornPicker: Boolean,
    isDisabled: Boolean,
    cards: Array,
    haveNextCards: Boolean,
    galleryStyle: String,
  },
  emits: ['reset-filters', 'load-more'],
  components: {
    CardTableRow,
    Card,
  },
  mounted () {
    this.debouncedScrollListener = debounce(this.scrollLoadCheck, 100)
    window.addEventListener('scroll', this.debouncedScrollListener)
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.debouncedScrollListener)
  },
  computed: {
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
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
.listColumns {
  grid-template-columns: auto 1fr auto max-content;
}

.deckbuilderListColumns {
  grid-template-columns: auto auto 1fr auto max-content;
}

.cardColumns {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
