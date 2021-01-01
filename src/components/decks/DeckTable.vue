<template>
  <div v-if="!isDisabled && (!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No decks found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="decks && decks.length">
    <deck v-for="deck of decks" :key="deck.id" :deck="deck"></deck>
    <div v-show="havePreviousDecks || haveNextDecks" class="my-4 text-center">
      <button v-show="havePreviousDecks" class="btn btn-blue py-2 px-4 mr-4" :disabled="isDisabled" @click="$emit('load-previous')">
        Previous
      </button>
      <button  v-show="haveNextDecks" class="btn btn-blue py-2 px-4" :disabled="isDisabled" @click="$emit('load-next')">
        Next
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
    havePreviousDecks: Boolean,
  },
  emits: ['reset-filters', 'load-next', 'load-previous'],
  components: {
    Deck,
  },
}
</script>