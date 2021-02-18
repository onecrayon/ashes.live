<template>
  <div v-if="!isDisabled && (!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <div v-if="!haveFilters && showMine && !showLegacy">
      <p class="text-lg mb-8">
        You have not created any decks yet!
      </p>
      <p>
        <button class="btn btn-green px-4 py-2" @click="newDeck">
          <i class="fas fa-plus"></i>
          Create your first deck
        </button>
      </p>
    </div>
    <div v-else-if="!haveFilters && showMine && showLegacy">
      <p class="text-lg mb-8">
        <strong>Legacy decks are read-only.</strong> To create a new deck, please view your <router-link to="/decks/mine/">Reborn decks</router-link>.
      </p>
    </div>
    <div v-else>
      <h2>No decks found</h2>

      <p v-if="haveFilters">
        <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
      </p>
    </div>
  </div>
  <div v-else-if="decks && decks.length">
    <deck v-for="deck of decks" :key="deck.id" :deck="deck" :show-mine="showMine"></deck>
    <div class="my-4 text-center">
      Page {{ currentPage }} of {{ totalPage }}
    </div>
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
import Deck from './Deck.vue'

export default {
  name: 'DeckTable',
  props: {
    isDisabled: Boolean,
    decks: Array,
    haveNextDecks: Boolean,
    havePreviousDecks: Boolean,
    currentPage: Number,
    totalPage: Number,
    showMine: {
      type: Boolean,
      default: false,
    },
    haveFilters: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['reset-filters', 'load-next', 'load-previous'],
  components: {
    Deck,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
  },
  methods: {
    newDeck () {
      this.$store.commit('builder/enable')
    },
  },
}
</script>
